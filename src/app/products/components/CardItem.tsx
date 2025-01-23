// components/store/CartItem.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Download } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/store';
import  useCart  from '@/hooks/useCart';
import { Product } from '@/types/store/product';
import { useProduct } from '@/hooks/useProducts';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { updateQuantity, removeItem } = useCart();
  const { products } = useProduct()
  const [product, setProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        if(!products || products.length === 0) return;
        const foundProduct = products.find(p => p.id === item.productId)
        setProduct(foundProduct)
    },[products, item.productId])


  const handleQuantityChange = async (value: string) => {
    const quantity = parseInt(value);
    if (quantity < 1) return;
    
    try {
      await updateQuantity(item.productId, quantity);
      onQuantityChange?.(quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeItem(item.productId);
      onRemove?.();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(false);
    }
  };
    
      if (!product) {
        return <div>Loading product details...</div>
    }

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground">
              {product.type === 'digital' ? 'Digital Product' : 'Physical Product'}
            </p>
          </div>
          <p className="font-medium">${product.price.toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <Select
              value={item.quantity.toString()}
              onValueChange={handleQuantityChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {product.type === 'digital' && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Example usage of multiple cart items in a list:
export function CartItemList() {
  const { cart } = useCart();

  if (!cart?.items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <CartItem 
          key={item.productId} 
          item={item}
        />
      ))}
    </div>
  );
}