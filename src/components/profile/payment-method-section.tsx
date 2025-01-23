'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Phone } from 'lucide-react'

export function PaymentMethodSection() {
  const { paymentMethods, addPaymentMethod, deletePaymentMethod } = useAppStore()
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'credit-card' as const,
    lastFour: '',
    expiryDate: '',
    phoneNumber: '',
  })

  const handleAddPaymentMethod = () => {
    addPaymentMethod(newPaymentMethod)
    setNewPaymentMethod({ type: 'credit-card', lastFour: '', expiryDate: '', phoneNumber: '' })
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Payment Method</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup
              value={newPaymentMethod.type}
              onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, type: value as 'credit-card' | 'mtn-momo' | 'orange-money' })}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="add-credit-card" />
                  <Label htmlFor="add-credit-card" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mtn-momo" id="add-mtn-momo" />
                  <Label htmlFor="add-mtn-momo" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>MTN Mobile Money</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="orange-money" id="add-orange-money" />
                  <Label htmlFor="add-orange-money" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Orange Money</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {newPaymentMethod.type === 'credit-card' && (
              <>
                <div>
                  <Label htmlFor="lastFour">Last 4 digits</Label>
                  <Input
                    id="lastFour"
                    value={newPaymentMethod.lastFour}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, lastFour: e.target.value })}
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={newPaymentMethod.expiryDate}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                  />
                </div>
              </>
            )}
            {newPaymentMethod.type === 'mtn-momo' && (
              <div>
                <Label htmlFor="mtnMomoNumber">MTN Mobile Money Number</Label>
                <Input
                  id="mtnMomoNumber"
                  value={newPaymentMethod.phoneNumber || ''}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, phoneNumber: e.target.value })}
                  placeholder="Enter your MTN MoMo number"
                />
              </div>
            )}
            {newPaymentMethod.type === 'orange-money' && (
              <div>
                <Label htmlFor="orangeMoneyNumber">Orange Money Number</Label>
                <Input
                  id="orangeMoneyNumber"
                  value={newPaymentMethod.phoneNumber || ''}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, phoneNumber: e.target.value })}
                  placeholder="Enter your Orange Money number"
                />
              </div>
            )}
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddPaymentMethod}>Add Payment Method</Button>
          </div>
        </DialogContent>
      </Dialog>
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardHeader>
            <CardTitle>{method.type === 'credit-card' ? 'Credit Card' : method.type === 'mtn-momo' ? 'MTN Mobile Money' : 'Orange Money'}</CardTitle>
          </CardHeader>
          <CardContent>
            {method.type === 'credit-card' && (
              <>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <p>**** **** **** {method.lastFour}</p>
                </div>
                <p>Expires: {method.expiryDate}</p>
              </>
            )}
            {method.type === 'mtn-momo' && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <p>MTN Mobile Money: {method.phoneNumber}</p>
              </div>
            )}
            {method.type === 'orange-money' && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <p>Orange Money: {method.phoneNumber}</p>
              </div>
            )}
            <Button variant="outline" className="mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => deletePaymentMethod(method.id)}>Delete</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

