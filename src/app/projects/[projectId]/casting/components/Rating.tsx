// app/projects/[projectId]/casting/components/Rating.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
    rating: number;
    size?: number
}

export function Rating({rating, size = 16}: RatingProps) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star 
                key={i}
                className={cn(
                    "h-3 w-3",
                    i <= rating ? "fill-yellow-500 text-yellow-500" : 'text-muted-foreground'
                )}
                size={size}
            />
        )
    }

    return (
        <div className="flex items-center">
            {stars}
        </div>
    )
}