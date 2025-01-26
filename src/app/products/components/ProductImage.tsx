// components/ProductImage.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string | undefined;
  alt: string;
  view?: 'grid' | 'list';
  className?: string
}

const ProductImage = ({ src, alt, view, className }: ProductImageProps) => {
  return (
    <div className={cn(
      "relative aspect-square overflow-hidden",
      view === 'list' && "w-48",
      className
    )}>
      <div className="w-full h-full">
        <Image
            src={src || '/placeholder.png'}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
        />
      </div>
    </div>
  );
};

export default ProductImage;