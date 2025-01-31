// components/store/OrderSummary.tsx
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import  useCart  from 'others/useCart';


interface OrderSummaryProps {
  editable?: boolean;
  onCheckout?: () => void;
}

export function OrderSummary({ editable = true, onCheckout }: OrderSummaryProps) {
    const { cart, isLoading, error } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode || !cart) return;

      setApplyingCoupon(true);
    try {
      // This would connect to your API to validate the coupon
      const isValid = await validateCoupon(couponCode);
      
      if (isValid) {
        setCouponSuccess('Coupon applied successfully!');
        setCouponError(null);
         // Apply coupon logic goes here
      } else {
        setCouponError('Invalid coupon code');
        setCouponSuccess(null);
      }
    } catch (error) {
        console.error("Failed to apply coupon", error);
      setCouponError('Failed to apply coupon');
      setCouponSuccess(null);
    } finally {
          setApplyingCoupon(false);
    }
  };

  // Temporary function - replace with actual API call
  const validateCoupon = async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(code === 'DISCOUNT10');
      }, 500);
    });
  };
    
    if (isLoading) {
        return <div>Loading cart...</div>
    }
    
     if (error) {
        return <div>Error: {error}</div>
    }

  if (!cart || !cart.items) return null;
  
    const hasDiscount = cart.couponCode && couponSuccess;
    const discountAmount = hasDiscount ?  (cart.subtotal * 0.1) : 0;
    const discountedTotal = cart.total - discountAmount;


  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      
      {/* Items Summary */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <div className="flex-1">
              <p className="font-medium">{item.productId}</p> {/* Changed to use productId */}
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              ${(10 * item.quantity).toFixed(2)} {/* Placeholder: item.price logic will need to be implemented */}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Coupon Code */}
      {editable && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="pl-10"
                  disabled={applyingCoupon}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={applyingCoupon}
            >
              Apply
            </Button>
          </div>

          {couponError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{couponError}</AlertDescription>
            </Alert>
          )}

          {couponSuccess && (
            <Alert variant="default" className="border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>{couponSuccess}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p>${cart.subtotal.toFixed(2)}</p>
        </div>
         {hasDiscount && (
          <div className="flex justify-between text-green-500">
            <p>Discount</p>
              <p>-${discountAmount.toFixed(2)}</p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-muted-foreground">Tax</p>
          <p>${cart.tax.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between">
          <p className="text-muted-foreground">Shipping</p>
          <p>${cart.shipping.toFixed(2)}</p>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-semibold">
          <p>Total</p>
            <p>${discountedTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Checkout Button */}
      {editable && (
        <Button 
          className="w-full" 
          onClick={onCheckout}
          disabled={cart.items.length === 0}
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
}