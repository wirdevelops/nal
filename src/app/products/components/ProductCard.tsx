// components/store/ProductCard.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  ShoppingCart,
  Heart,
    HeartOff,
    Edit
} from 'lucide-react';
import type { Product, ProductType, ProductCategory } from '@/types/store/product';
import { useProduct } from '@/hooks/useProducts';
import  useCart  from '@/hooks/useCart';
import { toast } from 'react-hot-toast';


// Filter type definition
interface FilterState {
  type: ProductType[];
  category: ProductCategory[];
  priceRange: [number, number];
  condition?: string[];
  inStock?: boolean;
  sortBy: string;
}

// Product Card Component
function ProductCard({
    product,
    view,
   isFavorite
  }: {
    product: Product;
    view: 'grid' | 'list';
    isFavorite: boolean
  }) {

  const { toggleFavorite } = useProduct();
  const { addItem } = useCart();
    const currentUserId = 'test';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product.id, 1);
         toast.success('Added to cart')
    };

  const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
       toggleFavorite(product.id);
  };
    return (
      <Link href={`/products/${product.id}`}>
        <Card className={cn(
        "overflow-hidden",
        view === 'list' && "flex"
      )}>
        <div className={cn(
          "relative aspect-square",
          view === 'list' && "w-48"
        )}>
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.title}
            className="object-cover w-full h-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleFavorite}
          >
           {isFavorite ? <Heart  className="h-5 w-5 text-primary" fill="currentColor" /> : <HeartOff className="h-5 w-5" />}
          </Button>
           {product.sellerId === currentUserId && (
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2"
          >
             <Edit className="h-5 w-5" />
          </Button>
            )}
        </div>
  
        <div className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.type === 'physical' ? product.condition : product.fileType}
                </p>
              </div>
              <p className="font-semibold">${product.price.toFixed(2)}</p>
            </div>
          </CardHeader>
  
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {(product.tags || []).map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
  
          <CardFooter>
            <Button className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
             {isFavorite ? 'Move to Cart' : 'Add to Cart'}
            </Button>
          </CardFooter>
        </div>
      </Card>
         </Link>
    );
  }

  export default ProductCard