'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Header } from "@/components/homer/header"
import { BottomNav } from "@/components/homer/bottom-nav"
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage() {
  const orders = useAppStore((state) => state.orders)
  const latestOrder = orders[orders.length - 1]

  return (
    <div className="min-h-screen bg-[#f8f5f2] pb-16">
      <Header />
      <main className="container px-4 py-6 md:px-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-[#1a472a] mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p>Order Number: {latestOrder.id}</p>
            <p>Date: {new Date(latestOrder.date).toLocaleDateString()}</p>
            <p>Total: {latestOrder.total}</p>
          </div>
          <Link href="/shop">
            <Button className="bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

