'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

export function OrderHistorySection() {
  const { orders, reorder, updateOrderStatus } = useAppStore()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const handleReorder = (orderId: string) => {
    reorder(orderId)
  }

  const handleUpdateStatus = (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    updateOrderStatus(orderId, status)
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Status: {order.status}</p>
            <p>Total: {formatCurrency(order.total)}</p>
            <div className="mt-4 space-x-2">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline" onClick={() => setExpandedOrder(order.id)}>View Details</Button>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline" onClick={() => handleReorder(order.id)}>Reorder</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline">Update Status</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleUpdateStatus(order.id, 'Processing')}>Processing</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>Shipped</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleUpdateStatus(order.id, 'Delivered')}>Delivered</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {expandedOrder === order.id && (
              <div className="mt-4">
                <h4 className="font-semibold">Order Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} - Quantity: {item.quantity} - Price: {formatCurrency(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

