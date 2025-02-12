import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function NewsPreview() {
  const news = [
    {
      id: 1,
      title: 'New Community Center Opens',
      excerpt: 'Supporting local youth with education and resources...',
      image: '/news/community-center.jpg',
      date: '2024-01-10'
    },
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.excerpt}
                </p>
                <Button variant="link" className="px-0">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}