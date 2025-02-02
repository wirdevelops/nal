// 'use client'

// import { useState } from 'react'
// import { useAppStore } from '@/lib/store'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// export function ShippingAddressSection() {
//   const { shippingAddresses, addShippingAddress, updateShippingAddress, deleteShippingAddress } = useAppStore()
//   const [newAddress, setNewAddress] = useState({
//     fullName: '',
//     address: '',
//     city: '',
//     country: '',
//     postalCode: '',
//   })

//   const handleAddAddress = () => {
//     addShippingAddress(newAddress)
//     setNewAddress({ fullName: '', address: '', city: '', country: '', postalCode: '' })
//   }

//   return (
//     <div className="space-y-4">
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Address</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Shipping Address</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="fullName">Full Name</Label>
//               <Input
//                 id="fullName"
//                 value={newAddress.fullName}
//                 onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 value={newAddress.address}
//                 onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="city">City</Label>
//               <Input
//                 id="city"
//                 value={newAddress.city}
//                 onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="country">Country</Label>
//               <Input
//                 id="country"
//                 value={newAddress.country}
//                 onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="postalCode">Postal Code</Label>
//               <Input
//                 id="postalCode"
//                 value={newAddress.postalCode}
//                 onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
//               />
//             </div>
//             <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddAddress}>Add Address</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       {shippingAddresses.map((address) => (
//         <Card key={address.id}>
//           <CardHeader>
//             <CardTitle>{address.fullName}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>{address.address}</p>
//             <p>{address.city}, {address.country} {address.postalCode}</p>
//             <div className="mt-4 space-x-2">
//               <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline" onClick={() => deleteShippingAddress(address.id)}>Delete</Button>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline">Edit</Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Edit Shipping Address</DialogTitle>
//                   </DialogHeader>
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor={`fullName-${address.id}`}>Full Name</Label>
//                       <Input
//                         id={`fullName-${address.id}`}
//                         defaultValue={address.fullName}
//                         onChange={(e) => updateShippingAddress(address.id, { ...address, fullName: e.target.value })}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`address-${address.id}`}>Address</Label>
//                       <Input
//                         id={`address-${address.id}`}
//                         defaultValue={address.address}
//                         onChange={(e) => updateShippingAddress(address.id, { ...address, address: e.target.value })}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`city-${address.id}`}>City</Label>
//                       <Input
//                         id={`city-${address.id}`}
//                         defaultValue={address.city}
//                         onChange={(e) => updateShippingAddress(address.id, { ...address, city: e.target.value })}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`country-${address.id}`}>Country</Label>
//                       <Input
//                         id={`country-${address.id}`}
//                         defaultValue={address.country}
//                         onChange={(e) => updateShippingAddress(address.id, { ...address, country: e.target.value })}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`postalCode-${address.id}`}>Postal Code</Label>
//                       <Input
//                         id={`postalCode-${address.id}`}
//                         defaultValue={address.postalCode}
//                         onChange={(e) => updateShippingAddress(address.id, { ...address, postalCode: e.target.value })}
//                       />
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

