import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, HeartOff, Edit } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUserere';
import { useProducts } from '@/hooks/useProducts';
import  useCart  from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import type { PhysicalProduct, Product } from '@/types/store';

export function isPhysicalProduct(product: Product): product is PhysicalProduct {
  return product.type === 'physical';
}

export function getInventoryStatus(product: Product) {
  if (!isPhysicalProduct(product)) {
    return {
      isOutOfStock: false,
      showLowStockBadge: false,
      stock: undefined,
      backorder: undefined,
      alerts: undefined
    };
  }

  const inventory = product.inventory;
  const isOutOfStock = inventory?.stock <= 0 && !inventory?.backorder;
  const showLowStockBadge = inventory?.alerts?.enabled && 
    inventory.stock <= (inventory.alerts.threshold || 0);

  return {
    isOutOfStock,
    showLowStockBadge,
    stock: inventory?.stock,
    backorder: inventory?.backorder,
    alerts: inventory?.alerts
  };
}

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view }: ProductCardProps) {
  const { user, userActions } = useUser();
  const { addItem } = useCart();
  const { toggleFavorite, favoriteIds } = useProducts();
  const isFavorite = favoriteIds.includes(product.id);
  const isProductOwner = user?.id === product.sellerId;
  const isVendor = userActions.hasRole('vendor');
  const canEdit = isProductOwner || isVendor;
  
  const physicalProduct = product.type === 'physical' ? (product as PhysicalProduct) : null;
  const inventory = physicalProduct?.inventory;
  const isOutOfStock = inventory ? 
    (inventory.stock <= 0 && !inventory.backorder) : false;

  const showLowStockBadge = inventory?.alerts && 
    inventory.alerts.enabled && 
    inventory.stock <= inventory.alerts.threshold;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await toast.promise(
      addItem(product.id, 1),
      {
        loading: 'Adding to cart...',
        success: 'Added to cart!',
        error: (err) => err.message || 'Failed to add to cart'
      }
    );
  };

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }
    toggleFavorite(product.id);
  };

 
  return (
    <Link href={`/products/${product.id}`} className="block">
      <Card className={cn(
        "overflow-hidden transition-shadow hover:shadow-lg",
        view === 'list' && "flex"
      )}>
        <div className={cn(
          "relative aspect-square",
          view === 'list' && "w-48"
        )}>
          <div className="w-full h-full">
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>

          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <Heart className="h-5 w-5 text-primary" fill="currentColor" />
              ) : (
                <HeartOff className="h-5 w-5" />
              )}
            </Button>

            {canEdit && (
              <Link 
                href={`/products/${product.id}/edit`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                  aria-label="Edit product"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {showLowStockBadge && (
            <Badge variant="destructive" className="absolute bottom-2 left-2">
              Low Stock
            </Badge>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="line-clamp-2 text-base leading-tight">
                {product.title}
              </CardTitle>
              <p className="font-semibold whitespace-nowrap">
                ${product.price.toLocaleString('en-US')}
              </p>
            </div>
            {showLowStockBadge && (
            <Badge variant="destructive" className="absolute bottom-2 left-2">
              Low Stock
            </Badge>
          )}
          </CardHeader>

          <CardContent className="pb-2 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}