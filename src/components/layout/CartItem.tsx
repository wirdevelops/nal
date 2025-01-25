import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useProductStore } from '@/stores/useProductStore';
import type { CartItem as CartItemType } from '@/types/store';
import type { Product } from '@/types/store';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { products } = useProductStore();
  const { removeItemFromCart, updateItemQuantity } = useCartStore();

  const product = products.find(p => p.id === item.productId) as Product;
  if (!product) return null;

  const handleRemove = () => {
    setIsRemoving(true);
    removeItemFromCart(item.productId);
    setIsRemoving(false);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex gap-4 py-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">{product.title}</h4>
            <p className="text-sm text-muted-foreground">
              ${(product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <div className="h-8 px-3 flex items-center justify-center border-y">
              {item.quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}