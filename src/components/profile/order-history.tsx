import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const orders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "Delivered",
    total: 94.50,
    items: [
      {
        name: "Organic Hair Oil",
        quantity: 1,
        price: 35.00,
        image: "/placeholder.svg",
      },
      {
        name: "Fresh Body Oil",
        quantity: 1,
        price: 30.75,
        image: "/placeholder.svg",
      },
    ],
  },
]

export function OrderHistory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-medium text-[#1a472a]">
        Order History
      </h2>
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Order #{order.id}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm font-medium">Total</div>
              <div className="font-medium">${order.total.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

