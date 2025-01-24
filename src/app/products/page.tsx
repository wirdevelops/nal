'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2 } from 'lucide-react';
import { ProductCreationForm } from './components/ProductCreationForm';
import { useUser } from '@/hooks/useUser';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './components/ProductCard';
import EmptyProjects from './components/EmptyProjects';

export default function ProjectListingPage() {
  const [open, setOpen] = useState(false);
  const { user, userActions } = useUser();
  const { isLoading, filteredProducts: products } = useProducts();

  const canCreateProject = user && (
    userActions.hasRole('project-owner') || 
    userActions.hasRole('admin')
  );

  const handleCreateClick = () => setOpen(true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Projects</h1>
          {user && <p className="text-muted-foreground">Welcome back, {user.name.first}</p>}
        </div>
        {canCreateProject && products.length > 0 && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[100vw] sm:w-[540px]">
              <ProductCreationForm onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      ) : (
        <>
          <EmptyProjects onCreateClick={handleCreateClick} canCreate={canCreateProject} />
          {canCreateProject && open && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent side="right" className="w-[100vw] sm:w-[540px]">
                <ProductCreationForm onClose={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          )}
        </>
      )}
    </div>
  );
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

