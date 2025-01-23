import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImages: {
    url: string;
    alt: string;
  }[];
  ctaButtons: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary';
  }[];
}

export function HeroSection({ 
  content = {
    title: "Transforming Stories Into Reality",
    subtitle: "Join a community of creative visionaries bringing impactful stories to life",
    backgroundImages: [
      {
        url: "/hero-1.jpg",
        alt: "Film production scene"
      },
      {
        url: "/hero-2.jpg",
        alt: "Behind the scenes"
      }
    ],
    ctaButtons: [
      {
        text: "Explore Projects",
        link: "/projects",
        variant: "primary"
      },
      {
        text: "Join Our Community",
        link: "/join",
        variant: "secondary"
      }
    ]
  }
}: {
  content?: HeroContent;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      (prev + 1) % content.backgroundImages.length
    );
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      (prev - 1 + content.backgroundImages.length) % content.backgroundImages.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Images */}
      {content.backgroundImages.map((image, index) => (
        <div
          key={image.url}
          className={cn(
            "absolute inset-0 transition-transform duration-1000",
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
            onTransitionEnd={() => setIsTransitioning(false)}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 
            className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight",
              "animate-in slide-in-from-bottom duration-500"
            )}
          >
            {content.title}
          </h1>
          <p 
            className={cn(
              "text-xl md:text-2xl text-white/80",
              "animate-in slide-in-from-bottom duration-500 delay-200"
            )}
          >
            {content.subtitle}
          </p>
          <div 
            className={cn(
              "flex flex-wrap gap-4 justify-center",
              "animate-in slide-in-from-bottom duration-500 delay-300"
            )}
          >
            {content.ctaButtons.map((button) => (
              <Button
                key={button.text}
                variant={button.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  "min-w-[200px]",
                  button.variant === 'primary' 
                    ? "bg-white text-primary hover:bg-white/90"
                    : "border-white text-white hover:bg-white/20"
                )}
                asChild
              >
                <a href={button.link}>{button.text}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {content.backgroundImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentImageIndex 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-white/20"
        onClick={prevImage}
        disabled={isTransitioning}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-white/20"
        onClick={nextImage}
        disabled={isTransitioning}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}

interface HeroContent {
    title: string;
    subtitle: string;
    backgroundImages: {
      url: string;
      alt: string;
    }[];
    ctaButtons: {
      text: string;
      link: string;
      variant: 'primary' | 'secondary';
    }[];
  }