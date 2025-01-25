import { CartItem } from '../../../components/layout/CartItem';
import { useCartStore } from '@/stores/useCartStore';
import { ShoppingCart } from 'lucide-react';

export function CartItemList() {
  const { cart } = useCartStore();

  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <CartItem key={item.productId} item={item} />
      ))}
    </div>
  );
}