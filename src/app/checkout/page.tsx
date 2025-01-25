'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Phone, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import type { OrderItem } from '@/types/store';

const STEPS = [
  { id: 'shipping', label: 'Shipping Address' },
  { id: 'payment', label: 'Payment Method' },
  { id: 'review', label: 'Review Order' }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  
  const { cart, updateItemQuantity, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { products, validateStock } = useProductStore();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = cart?.items || [];
  
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const shipping = 10;
    const tax = subtotal * 0.1;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax
    };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const validateOrder = () => {
    return cartItems.every(item => 
      validateStock(item.productId, item.quantity)
    );
  };

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      alert('Some items are out of stock');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert cart items to order items with proper typing
      const orderItems: OrderItem[] = cartItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        
        // Explicitly construct OrderItem with correct types
        const orderItem: OrderItem = {
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: product.price,
          ...(item.options && { options: item.options }),
          ...(item.promotionId && { promotionId: item.promotionId }),
          ...(product.type === 'digital' && { 
            downloadStatus: 'pending' as const 
          })
        };

        return orderItem;
      });

      const newOrder = createOrder(orderItems, {
        gateway: paymentMethod,
        transactionId: Date.now().toString(),
        billingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country,
          zipCode: shippingInfo.zipCode
        }
      });
  
      clearCart();
      router.push(`/order-confirmation/${newOrder.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderShippingForm = () => (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentStep(1); }}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={shippingInfo.firstName} 
            onChange={e => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
            required 
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={shippingInfo.lastName}
            onChange={e => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={shippingInfo.email}
          onChange={e => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          value={shippingInfo.phone}
          onChange={e => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          value={shippingInfo.address}
          onChange={e => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            value={shippingInfo.city}
            onChange={e => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input 
            id="state" 
            value={shippingInfo.state}
            onChange={e => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input 
            id="zipCode" 
            value={shippingInfo.zipCode}
            onChange={e => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            value={shippingInfo.country}
            onChange={e => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Continue to Payment</Button>
    </form>
  );

  const renderPaymentForm = () => (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }}>
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit Card</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer">
            <RadioGroupItem value="momo" id="momo" />
            <Label htmlFor="momo" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Mobile Money</span>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {paymentMethod === 'credit-card' ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" required />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" required />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="momoNumber">Mobile Money Number</Label>
          <Input id="momoNumber" placeholder="Enter your mobile number" required />
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
        <Button type="submit" className="flex-1">Continue to Review</Button>
      </div>
    </form>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <p className="text-sm text-muted-foreground">
          {shippingInfo.firstName} {shippingInfo.lastName}<br />
          {shippingInfo.address}<br />
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
          {shippingInfo.country}
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Payment Method</h3>
        <p className="text-sm text-muted-foreground">
          {paymentMethod === 'credit-card' ? 'Credit Card' : 'Mobile Money'}
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
        <Button 
          onClick={handlePlaceOrder} 
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <nav className="flex items-center justify-center space-x-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2",
                currentStep >= index 
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
            </div>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-6">
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep].label}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && renderShippingForm()}
                {currentStep === 1 && renderPaymentForm()}
                {currentStep === 2 && renderReviewStep()}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>{product.title} × {item.quantity}</span>
                        <span>${(product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}