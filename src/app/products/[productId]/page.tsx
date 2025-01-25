'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Heart } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProductStore } from '@/stores/useProductStore';
import {useCartStore} from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import type { PhysicalProduct, DigitalProduct } from '@/types/store';
import { isPhysicalProduct, getInventoryStatus } from '@/utils/product-utils';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = params;
  const router = useRouter();
  
  const { filteredProducts: products, removeProduct, isLoading, error, toggleFavorite, favoriteIds } = useProductStore();
  const { addItem } = useCartStore();
  const { user, userActions } = useUserStore();
  
  const product = products.find(p => p.id === productId);
  const isFavorite = favoriteIds.includes(productId);
  const isProductOwner = user?.id === product?.sellerId;
  const isVendor = userActions.hasRole('vendor');
  const canEdit = isProductOwner || isVendor;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">{error || 'Product not found'}</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const productType = isPhysicalProduct(product);
  const physicalProduct = productType ? product as PhysicalProduct : null;
  const digitalProduct = !productType ? product as DigitalProduct : null;
  
  const { isOutOfStock, showLowStockBadge } = getInventoryStatus(product);

  const handleDelete = async () => {
    try {
      await removeProduct(productId);
      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addItem(productId, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }
    toggleFavorite(productId);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge>{product.type}</Badge>
                {showLowStockBadge && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="group"
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : 'group-hover:fill-primary/20'}`}
                />
              </Button>
              {canEdit && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        product and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {physicalProduct ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm">Condition</p>
                  <p className="capitalize">{physicalProduct.condition}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Brand</p>
                  <p>{physicalProduct.brand}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Model</p>
                  <p>{physicalProduct.model}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Stock</p>
                  <p>{physicalProduct.inventory.stock} units</p>
                </div>
              </div>

              {Object.entries(physicalProduct.specifications).length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Specifications</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(physicalProduct.specifications).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {physicalProduct.shippingOptions.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Shipping Options</p>
                  <div className="space-y-2">
                    {physicalProduct.shippingOptions.map((option, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{option.name}</span>
                        <span>${option.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : digitalProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm">File Type</p>
                  <p>{digitalProduct.fileType}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">File Size</p>
                  <p>{(digitalProduct.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <p className="font-medium text-sm">License</p>
                  <p className="capitalize">{digitalProduct.licenseType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Version</p>
                  <p>{digitalProduct.version}</p>
                </div>
              </div>

              {digitalProduct.compatibility.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Compatibility</p>
                  <div className="flex flex-wrap gap-2">
                    {digitalProduct.compatibility.map((item, index) => (
                      <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            {canEdit && (
              <Button variant="outline" onClick={() => router.push(`/products/${productId}/edit`)}>
                Edit Product
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map(related => (
              <Link 
                href={`/products/${related.id}`} 
                key={related.id}
                className="group rounded-lg border p-3 hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                  <Image
                    src={related.images?.[0] || '/placeholder.png'}
                    alt={related.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
                <h3 className="font-medium line-clamp-2">{related.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ${related.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}