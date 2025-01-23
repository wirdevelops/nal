'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Header } from "@/components/homer/header"
import { BottomNav } from "@/components/homer/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Phone } from 'lucide-react'

const steps = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const cart = useAppStore((state) => state.cart)
  const getCartTotal = useAppStore((state) => state.getCartTotal)
  const clearCart = useAppStore((state) => state.clearCart)
  const addOrder = useAppStore((state) => state.addOrder)
  const applyCoupon = useAppStore((state) => state.applyCoupon)

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(1)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleApplyCoupon = () => {
    const discount = applyCoupon(couponCode)
    if (discount !== null) {
      setAppliedDiscount(discount)
    } else {
      alert('Invalid coupon code')
    }
  }

  const handlePlaceOrder = () => {
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Processing',
      total: getCartTotal() * (1 - appliedDiscount / 100),
      items: cart,
    }
    addOrder(order)
    clearCart()
    router.push('/order-confirmation')
  }

  const subtotal = getCartTotal()
  const discountAmount = subtotal * (appliedDiscount / 100)
  const total = subtotal - discountAmount

  return (
    <div className="min-h-screen bg-[#f8f5f2] pb-16">
      <Header />
      <main className="container px-4 py-6 md:px-6">
        <h1 className="text-3xl font-bold text-[#1a472a] mb-6">Checkout</h1>
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${
                index <= currentStep ? 'text-[#1a472a]' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  index <= currentStep ? 'bg-[#1a472a] text-white' : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </div>
              {step}
            </div>
          ))}
        </div>
        {currentStep === 0 && (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={shippingInfo.country}
                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
              Continue to Payment
            </Button>
          </form>
        )}
        {currentStep === 1 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mtn-momo" id="mtn-momo" />
                  <Label htmlFor="mtn-momo" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>MTN Mobile Money</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="orange-money" id="orange-money" />
                  <Label htmlFor="orange-money" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Orange Money</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {paymentMethod === 'credit-card' && (
              <>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </>
            )}
            {paymentMethod === 'mtn-momo' && (
              <div>
                <Label htmlFor="mtnMomoNumber">MTN Mobile Money Number</Label>
                <Input id="mtnMomoNumber" placeholder="Enter your MTN MoMo number" required />
              </div>
            )}
            {paymentMethod === 'orange-money' && (
              <div>
                <Label htmlFor="orangeMoneyNumber">Orange Money Number</Label>
                <Input id="orangeMoneyNumber" placeholder="Enter your Orange Money number" required />
              </div>
            )}
            <Button type="submit" className="w-full bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
              Continue to Review
            </Button>
          </form>
        )}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <Button onClick={handleApplyCoupon}>Apply</Button>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Button onClick={handlePlaceOrder} className="w-full bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
              Place Order
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

