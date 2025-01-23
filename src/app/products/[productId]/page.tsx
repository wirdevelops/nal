// app/products/[productId]/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2 } from 'lucide-react';
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
import { useProduct } from '@/hooks/useProducts';
import type { Product, PhysicalProduct, DigitalProduct } from '@/types/store/product';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ProductDetailPageProps {
    params: {
        productId: string
    };
}

// Mock deleteProduct function - Replace with your actual implementation
const deleteProduct = async (productId: string) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
        //replace this with the actual deletion code
      console.log(`Product with ID: ${productId} deleted.`);
      resolve()
    }, 1000);
  });
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
    const { productId } = params;
    const { products, isLoading, error } = useProduct();
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const currentUserId = 'test'; // Replace with actual user ID logic


    useEffect(() => {
        if(!products || products.length === 0) return;
        const foundProduct = products.find(p => p.id === productId);
        setProduct(foundProduct);
    }, [productId, products]);

    const handleDelete = async () => {
      try {
          setIsDeleting(true);
          await deleteProduct(productId);
          toast.success('Product deleted successfully');
          router.push('/');
      } catch (error) {
          console.error('Failed to delete product:', error);
          toast.error('Failed to delete product');
      } finally {
          setIsDeleting(false);
      }
  };

    
    const DeleteButton = () => (
      <AlertDialog>
          <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Product'}
              </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      product and remove it from our servers.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                      Delete
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
  );

  const relatedProducts = products?.filter(p => product && p.category === product.category && p.id !== product.id).slice(0,5);

    if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error: {error}</div>;
    if (!product) {
        return (
            <div className="container mx-auto py-8">
              <p>Product not found.</p>
                 <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                        <Image
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.title}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex gap-2">
                       {product.images?.slice(1,4).map((image, index) => (
                         <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                                src={image}
                                alt={`${product.title} preview ${index}`}
                                layout="fill"
                                objectFit="cover"
                           />
                        </div>
                       ))}
                   </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                    <div className='flex justify-between items-center'>
                     <h1 className="text-3xl font-bold">{product.title}</h1>
                     <DeleteButton />
                    </div>
                    <div className="flex items-center gap-2">
                         {product.type === 'physical' && (
                             <Badge>Physical Product</Badge>
                            )}
                            {product.type === 'digital' && (
                                <Badge>Digital Product</Badge>
                            )}
                    </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <p className="text-sm text-gray-500">4.5</p>
                   </div>
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600">{product.description}</p>

                    {product.tags?.length > 0 && (
                        <div className="flex gap-2">
                            {product.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                        </div>
                    )}

                  {product.type === 'physical' && (
                   <div className="space-y-2">
                    <h3 className="font-semibold">Details</h3>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                         <p className="font-medium">Condition</p>
                              <p>{(product as PhysicalProduct).condition}</p>
                            </div>
                           <div className="space-y-1">
                                  <p className="font-medium">Brand</p>
                             <p>{(product as PhysicalProduct).brand}</p>
                           </div>
                        <div className="space-y-1">
                            <p className="font-medium">Model</p>
                            <p>{(product as PhysicalProduct).model}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="font-medium">Stock</p>
                               <p>{(product as PhysicalProduct).stock}</p>
                           </div>
                     </div>
                       {
                            (product as PhysicalProduct).specifications && Object.keys((product as PhysicalProduct).specifications).length > 0 && (
                               <div className="space-y-1">
                                <p className="font-medium">Specifications</p>
                                  <ul className="list-disc pl-4">
                                     {Object.entries((product as PhysicalProduct).specifications).map(([key, value]) => (
                                        <li key={key}>
                                            {key}: {value}
                                        </li>
                                     ))}
                                  </ul>
                                </div>
                            )
                        }
                    
                      {
                        (product as PhysicalProduct).includedItems && (product as PhysicalProduct).includedItems.length > 0 && (
                                <div className="space-y-1">
                                  <p className="font-medium">Included Items</p>
                                      <ul className="list-disc pl-4">
                                            {(product as PhysicalProduct).includedItems.map((item, index) => (
                                            <li key={index}>
                                                 {item}
                                             </li>
                                            ))}
                                      </ul>
                                  </div>
                            )
                        }
                       {
                         (product as PhysicalProduct).shippingOptions && (product as PhysicalProduct).shippingOptions.length > 0 && (
                             <div className="space-y-1">
                              <p className="font-medium">Shipping Options</p>
                                   <ul className="list-disc pl-4">
                                      {(product as PhysicalProduct).shippingOptions.map((option, index) => (
                                        <li key={index}>
                                        {option.name}: ${option.price}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                         )
                       }
                    </div>
                      )}

                      {product.type === 'digital' && (
                         <div className="space-y-2">
                         <h3 className="font-semibold">Details</h3>
                          <div className="space-y-1">
                             <p className="font-medium">File Type</p>
                              <p>{(product as DigitalProduct).fileType}</p>
                         </div>
                         <div className="space-y-1">
                              <p className="font-medium">File Size</p>
                            <p>{(product as DigitalProduct).fileSize} bytes</p>
                          </div>
                          {
                            (product as DigitalProduct).compatibility && (product as DigitalProduct).compatibility.length > 0 && (
                                 <div className="space-y-1">
                                   <p className="font-medium">Compatibility</p>
                                       <ul className="list-disc pl-4">
                                       {(product as DigitalProduct).compatibility.map((compatibility, index) => (
                                              <li key={index}>
                                              {compatibility}
                                             </li>
                                           ))}
                                     </ul>
                                 </div>
                             )
                           }
                        </div>
                      )}
                     <Button>Add to cart</Button>
                 </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
                    <div className="flex gap-6 overflow-x-auto">
                        {relatedProducts.map(related => (
                         <Link href={`/products/${related.id}`} key={related.id} className="border rounded-lg p-2 w-32 flex-shrink-0">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden">
                             <Image
                                src={related.images?.[0] || '/placeholder.png'}
                                alt={related.title}
                                layout="fill"
                                objectFit="cover"
                               />
                              </div>
                               <h3 className="text-sm font-medium mt-1 line-clamp-1">{related.title}</h3>
                                <p className="text-gray-500 text-xs">${related.price.toFixed(2)}</p>
                           </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;