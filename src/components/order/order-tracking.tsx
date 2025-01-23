'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function OrderTracking() {
  const [orderId, setOrderId] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<any>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const { orders, markOrderAsReceived, initiateDispute } = useAppStore()

  const handleTrackOrder = () => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setTrackingInfo(order)
    } else {
      setTrackingInfo(null)
      alert('Order not found')
    }
  }

  const handleMarkAsReceived = () => {
    markOrderAsReceived(orderId)
    setTrackingInfo(prevInfo => ({ ...prevInfo, status: 'Received' }))
  }

  const handleInitiateDispute = () => {
    initiateDispute(orderId, disputeReason)
    setTrackingInfo(prevInfo => ({ ...prevInfo, status: 'Disputed', disputeReason }))
    setDisputeReason('')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
      <div className="flex gap-4 mb-4">
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your order ID"
        />
        <Button onClick={handleTrackOrder}>Track</Button>
      </div>
      {trackingInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Order #{trackingInfo.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {trackingInfo.status}</p>
            {trackingInfo.trackingNumber && (
              <p>Tracking Number: {trackingInfo.trackingNumber}</p>
            )}
            {trackingInfo.shippingCarrier && (
              <p>Shipping Carrier: {trackingInfo.shippingCarrier}</p>
            )}
            {trackingInfo.estimatedDeliveryDate && (
              <p>Estimated Delivery: {new Date(trackingInfo.estimatedDeliveryDate).toLocaleDateString()}</p>
            )}
            {trackingInfo.status === 'Delivered' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mt-4">Mark as Received</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Order Receipt</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to mark this order as received? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkAsReceived}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {['Delivered', 'Received'].includes(trackingInfo.status) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 ml-2" variant="destructive">Initiate Dispute</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Initiate Dispute</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="disputeReason" className="text-right">
                        Reason for Dispute
                      </Label>
                      <Textarea
                        id="disputeReason"
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        className="col-span-3"
                        placeholder="Please explain the reason for your dispute"
                      />
                    </div>
                  </div>
                  <Button onClick={handleInitiateDispute} variant="destructive">Submit Dispute</Button>
                </DialogContent>
              </Dialog>
            )}
            {trackingInfo.status === 'Disputed' && (
              <div className="mt-4">
                <p className="text-red-500">Your order is currently under dispute.</p>
                <p className="mt-2"><strong>Dispute Reason:</strong> {trackingInfo.disputeReason}</p>
                <p className="mt-2">Our customer service team will review your dispute and contact you shortly.</p>
              </div>
            )}
            {trackingInfo.status === 'Resolved' && (
              <div className="mt-4">
                <p className="text-green-500">Your dispute has been resolved.</p>
                <p className="mt-2"><strong>Resolution:</strong> {trackingInfo.disputeResolution}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

