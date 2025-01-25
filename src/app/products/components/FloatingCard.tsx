import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useProductStore } from '@/stores/useProductStore';

export function FloatingCart() {
  const { cart } = useCartStore();
  const { products } = useProductStore();

  if (!cart?.items?.length) return null;

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:hidden">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
        <ShoppingCart className="mr-2 h-4 w-4" />
        {totalItems} {totalItems === 1 ? 'item' : 'items'} - ${totalPrice.toFixed(2)}
      </Button>
    </div>
  );
}