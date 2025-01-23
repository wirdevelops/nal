// app/page.tsx
'use client'
import React, {useState} from 'react';
import  ProductListingPage  from './components/ProductListingPage';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from 'lucide-react';
import { ProductCreationForm } from './components/ProductCreationForm';



export default function HomePage() {
    const [open, setOpen] = useState(false);
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-3xl font-bold ">Welcome to the Marketplace</h1>
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                       <Button>
                           <Plus className="h-4 w-4 mr-2" />
                           Create New Product
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                       <ProductCreationForm onClose={() => setOpen(false)} />
                  </SheetContent>
                 </Sheet>
             </div>
            <ProductListingPage />
         </div>
    )
}


// 'use client'

// import { useState } from 'react'
// import { Header } from "@/components/home/header"
// import { BottomNav } from "@/components/home/bottom-nav"
// import { ShopFilters } from "@/components/shop/shop-filters"
// import { ProductList } from "@/components/shop/product-list"
// import { FloatingCart } from "@/components/shop/floating-cart"

// export default function ShopPage() {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [sortOption, setSortOption] = useState('newest')
//   const [categoryFilter, setCategoryFilter] = useState('all')

//   return (
//     <div className="min-h-screen bg-[#f8f5f2] pb-16">
//       <Header />
//       <main className="container px-4 py-6 md:px-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-serif font-medium text-[#1a472a]">Shop</h1>
//         </div>
//         <ShopFilters
//           sortOption={sortOption}
//           onSortChange={setSortOption}
//           categoryFilter={categoryFilter}
//           onCategoryChange={setCategoryFilter}
//         />
//         <ProductList
//           sortOption={sortOption}
//           categoryFilter={categoryFilter}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//         />
//       </main>
//       <FloatingCart />
//       <BottomNav />
//     </div>
//   )
// }

