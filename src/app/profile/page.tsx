'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Header } from "@/components/homer/header"
import { BottomNav } from "@/components/homer/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShippingAddressSection } from '@/components/profile/shipping-address-section'
import { PaymentMethodSection } from '@/components/profile/payment-method-section'
import { OrderHistorySection } from '@/components/profile/order-history-section'
import { OrderTracking } from '@/components/order/order-tracking'

export default function ProfilePage() {
  const { userProfile, setUserProfile, theme, toggleTheme } = useAppStore()
  const [editedProfile, setEditedProfile] = useState(userProfile)

  const handleProfileUpdate = () => {
    setUserProfile(editedProfile)
  }

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="min-h-screen bg-[#f8f5f2] dark:bg-gray-900 pb-16">
        <Header />
        <main className="container px-4 py-6 md:px-6">
          <h1 className="text-3xl font-bold text-primary mb-6">Profile</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{userProfile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleProfileUpdate}>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <OrderHistorySection />
            </TabsContent>
            <TabsContent value="addresses">
              <ShippingAddressSection />
            </TabsContent>
            <TabsContent value="payment">
              <PaymentMethodSection />
            </TabsContent>
            <TabsContent value="tracking">
              <OrderTracking />
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <Button onClick={toggleTheme} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

