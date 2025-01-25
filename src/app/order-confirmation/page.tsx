'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from '@/stores/useOrderStore'
import { useParams } from 'next/navigation'

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { orders } = useOrderStore();
  const order = orders.find(order => order.id === orderId);

  if (!order) {
    return (
      <div className="container min-h-screen py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <Link href="/products">
            <Button className="bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
              Return To The Market Place
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total from found order
  const orderTotal = order.items.reduce((total, item) => 
    total + (item.priceAtTime * item.quantity), 0
  );

  return (
    <div className="container min-h-screen py-10">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-[#1a472a] mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your purchase</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 text-sm">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-medium">{order.id}</span>
            
            <span className="text-muted-foreground">Order Date:</span>
            <span className="font-medium">
  {new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>Product ID: {item.productId}</span>
                <span>${(item.priceAtTime * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/products">
          <Button 
            size="lg"
            className="bg-[#1a472a] text-white hover:bg-[#1a472a]/90"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}