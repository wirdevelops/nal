// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import  CartItemList from '../../../components/layout/CartItem';
import  useCart  from '@/hooks/useCart';

export const Header = () => {
   const { cart } = useCart();
    const cartQuantity = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;


    return (
      <header className="bg-gray-100 py-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">My Marketplace</Link>
             <nav>
               <ul className="flex space-x-4">
                <li>
                  <Sheet>
                     <SheetTrigger asChild>
                       <Button variant="outline" size="icon">
                         <ShoppingCart className="h-4 w-4" />
                            {cartQuantity > 0 && (
                             <span className="ml-1 text-sm">({cartQuantity})</span>
                               )}
                        </Button>
                     </SheetTrigger>
                       <SheetContent>
                            <div className="p-4">
                             <h2 className="text-lg font-semibold">Shopping Cart</h2>
                              <CartItemList item={item} />
                             <div className="flex justify-end mt-4">
                                   {cart && cart.items.length > 0 && (
                                    <Link href="/checkout">
                                        <Button>Go to Checkout</Button>
                                       </Link>
                                        )}
                               </div>
                            </div>
                       </SheetContent>
                  </Sheet>
                  </li>
                    <li><Link href="/login">Login</Link></li>
                </ul>
            </nav>
        </div>
      </header>
    );
};