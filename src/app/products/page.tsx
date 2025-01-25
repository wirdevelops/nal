'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Filter, Search, Grid, List, Plus, Sparkles } from 'lucide-react';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import ActiveFilters from './components/ActiveFilters';
import { CategoryNav } from './components/CategoryNav';
import { useProductStore } from '@/stores/useProductStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent} from"@/components/ui/card"
import { FilterState } from '@/types/store/product';
export default function MarketplacePage() {
  const [view, setView] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const { products, isLoading } = useProductStore();

  // Add animated hero section
  const HeroSection = () => (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-muted/50"
    >
      <div className="container flex flex-col items-center py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Filmmaker's Creative Marketplace
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Discover premium gear, digital assets, and tools to elevate your filmmaking
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Explore Trending
          </Button>
          <Button size="lg" variant="outline">
            Sell Your Gear
          </Button>
        </div>
      </div>
    </motion.section>
  );

  const FeaturedCarousel = () => (
    <section className="py-12 bg-muted/20">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Featured Filmmaking Gear</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 px-2">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              className="min-w-[300px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
  
  const CategorySpotlight = () => (
    <section className="py-12">
      <div className="container grid md:grid-cols-2 gap-8">
        <div className="relative rounded-xl overflow-hidden aspect-video">
          <Image
            src="/camera-gear.jpg"
            alt="Camera Gear"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
            <h3 className="text-2xl font-bold text-white">Professional Camera Gear</h3>
            <Button variant="secondary" className="mt-4">
              Shop Now
            </Button>
          </div>
        </div>
        
        <div className="relative rounded-xl overflow-hidden aspect-video">
          <Image
            src="/digital-tools.jpg"
            alt="Digital Tools"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
            <h3 className="text-2xl font-bold text-white">Digital Production Tools</h3>
            <Button variant="secondary" className="mt-4">
              Explore Assets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
  
  const VendorShowcase = () => (
    <section className="py-12 bg-background">
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Featured Creators</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredVendors.map(vendor => (
            <motion.div 
              key={vendor.id} 
              className="p-6 rounded-xl border hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={vendor.logo} />
                  <AvatarFallback className="bg-primary text-white">
                    {vendor.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.specialty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {vendor.featuredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    view="grid"
                    className="hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Animated skeleton loader
  const ProductLoader = () => (
    <div className={view === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "space-y-4"}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="space-y-2 pt-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCarousel />
      <CategorySpotlight />
      <VendorShowcase />
      <div className="container py-12 space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <TabsList className="bg-background/50 backdrop-blur">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="physical">Physical Gear</TabsTrigger>
              <TabsTrigger value="digital">Digital Assets</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4 flex-wrap grow justify-end">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search gear, presets, tools..."
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-[400px]">
                  <ProductFilters filters={undefined} onChange={function (filters: FilterState): void {
                    throw new Error('Function not implemented.');
                  } } />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ActiveFilters filters={undefined} onChange={function (filters: FilterState): void {
            throw new Error('Function not implemented.');
          } } />
        </Tabs>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <ProductLoader />
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"}
            >
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  view={view}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 'use client'

// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { 
//   Filter, 
//   Search,
//   Grid, 
//   List,
//   Plus,
// } from 'lucide-react';
// import ProductFilters from './components/ProductFilters';
// import ProductCard from './components/ProductCard';
// import ActiveFilters from './components/ActiveFilters';
// import { CategoryNav } from './components/CategoryNav';
// import { useProductStore } from '@/stores/useProductStore';
// import type { FilterState, ProductCategory, ProductCondition } from '@/types/store';

// export default function MarketplacePage() {
//   const [view, setView] = useState('grid');
//   const [filters, setFilters] = useState<FilterState>({
//     type: [] as ('physical' | 'digital')[],
//     category: [] as ProductCategory[],
//     priceRange: [0, 5000] as [number, number],
//     condition: [] as ProductCondition[],
//     inStock: undefined,
//     sortBy: 'newest',
//     search: ''
//   });

//   const { products, isLoading } = useProductStore();

//   return (
//     <div className="min-h-screen">
       
//       {/* Categories Navigation */}
//       <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container py-2">
//           <CategoryNav />
//         </div>
//       </div>

//       <div className="container py-6 space-y-6">
//         {/* Search and Filters Bar */}
//         <div className="flex items-center gap-4 flex-wrap">
//           <div className="flex-1 relative min-w-[200px]">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//             <Input
//               className="pl-10"
//               placeholder="Search products..."
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
//             />
//           </div>

//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filters
//               </Button>
//             </SheetTrigger>
//             <SheetContent>
//               <ProductFilters 
//                 filters={filters}
//                 onChange={setFilters}
//                 isLoading={isLoading}
//               />
//             </SheetContent>
//           </Sheet>

//           <div className="flex items-center gap-4">
//             <div className="flex gap-2">
//               <Button
//                 variant={view === 'grid' ? 'default' : 'outline'}
//                 size="icon"
//                 onClick={() => setView('grid')}
//               >
//                 <Grid className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={view === 'list' ? 'default' : 'outline'}
//                 size="icon"
//                 onClick={() => setView('list')}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//             <Button className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               New Product
//             </Button>
//           </div>
//         </div>

//         <ActiveFilters 
//           filters={filters} 
//           onChange={setFilters}
//           isLoading={isLoading}
//         />

//         {/* Product Grid */}
//         <div className={
//           view === 'grid' 
//             ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
//             : "space-y-4"
//         }>
//           {products.map((product) => (
//             <ProductCard 
//               key={product.id}
//               product={product}
//               view={view === 'grid' ? 'grid' : 'list'}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }