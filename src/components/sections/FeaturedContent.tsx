'use client';

interface FeaturedItem {
  title: string;
  category: string;
  image: string;
  description: string;
}

const featuredContent: FeaturedItem[] = [
  {
    title: "African Cyberfuture",
    category: "Film",
    image: "/placeholder1.jpg",
    description: "A groundbreaking documentary exploring the intersection of African traditions and technological innovation."
  },
  {
    title: "Afrobeat Revolution",
    category: "Music",
    image: "/placeholder2.jpg",
    description: "Contemporary artists reshaping the sound of African music for the global stage."
  },
  {
    title: "Neo-Traditional",
    category: "Fashion",
    image: "/placeholder3.jpg",
    description: "Where ancestral designs meet modern streetwear in a bold fusion of styles."
  }
];

export function FeaturedContent() {
  return (
    <section className="py-20 bg-background-secondary/50 dark:bg-background-secondary-dark/50 cyberpunk:bg-cyber-dark/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-display font-bold mb-12 text-text dark:text-text-dark cyberpunk:text-cyber-blue">
          Featured Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredContent.map((item, index) => (
            <div 
              key={item.title}
              className="group relative overflow-hidden rounded-xl bg-background dark:bg-background-dark cyberpunk:bg-cyber-black/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 cyberpunk:bg-cyber-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 cyberpunk:from-cyber-pink/20 cyberpunk:to-cyber-blue/20 group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="p-6">
                <span className="text-sm font-display text-primary dark:text-primary-dark cyberpunk:text-cyber-pink">
                  {item.category}
                </span>
                <h3 className="text-xl font-display font-bold mt-2 mb-3 text-text dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-dark cyberpunk:group-hover:text-cyber-blue">
                  {item.title}
                </h3>
                <p className="text-text-secondary dark:text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
