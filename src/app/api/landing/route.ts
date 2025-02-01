// app/api/landing/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Replace with your actual data fetching logic
  const mockData = {
    projects: [
      {
        id: '1',
        title: 'The Silent Echo',
        description: 'A groundbreaking documentary exploring sound design in cinema',
        coverImage: '/projects/silent-echo.jpg',
        category: 'Documentary',
        progress: 75,
        location: 'Los Angeles, CA',
        date: '2024-02-01'
      },
    ],
    stats: [
      {
        label: "Productions",
        value: "150+",
        description: "Successful film and TV projects",
        icon: "Film",
        trend: 15
      },
      // Add more stats...
    ],
    opportunities: [
      {
        id: '1',
        type: 'job',
        title: 'Senior Film Editor',
        description: 'Looking for an experienced editor for our upcoming feature film',
        deadline: '2024-03-01',
        requirements: [
          '5+ years experience in feature film editing',
          'Proficiency in Adobe Premiere Pro',
          'Strong storytelling abilities'
        ],
        location: 'New York, NY',
        compensation: '$80,000 - $100,000/year'
      },
      // Add more opportunities...
    ],
    episodes: [
      {
        id: '1',
        title: 'The Art of Visual Storytelling',
        description: 'In-depth discussion with award-winning cinematographer John Doe',
        duration: '45 min',
        publishDate: '2024-01-15',
        thumbnail: '/episodes/ep1.jpg',
        audioUrl: '/episodes/ep1.mp3',
        category: 'Cinematography',
        listens: 1250
      },
      // Add more episodes...
    ],
    products: [
      {
        id: '1',
        name: 'Professional Camera Rig',
        description: 'Complete camera rig system for professional filmmaking',
        price: 2999.99,
        discountedPrice: 2499.99,
        images: ['/products/camera-rig-1.jpg', '/products/camera-rig-2.jpg'],
        category: 'Equipment',
        rating: 4.8,
        stock: 15,
        tags: ['camera', 'professional', 'filming']
      },
      // Add more products...
    ]
  };

  return NextResponse.json(mockData);
}