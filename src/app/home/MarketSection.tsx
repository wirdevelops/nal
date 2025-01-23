import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, Heart, Star, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
  tags: string[];
  isFeatured?: boolean;
}

export function MarketSection({ products = [] }: { products: Product[] }) {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Film Industry Market</h2>
            <p className="text-muted-foreground">Professional gear and creative resources</p>
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="gear">Gear</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              isFavorite={favoriteIds.includes(product.id)}
              onFavoriteToggle={() => {
                setFavoriteIds(prev => 
                  prev.includes(product.id)
                    ? prev.filter(id => id !== product.id)
                    : [...prev, product.id]
                );
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ 
  product, 
  isFavorite, 
  onFavoriteToggle 
}: { 
  product: Product;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <Card className="group">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            {product.isFeatured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle();
              }}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : ""
                )} 
              />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {product.stock} in stock
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-semibold">
                ${product.discountedPrice ?? product.price}
              </div>
              {product.discountedPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  ${product.price}
                </div>
              )}
            </div>
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}