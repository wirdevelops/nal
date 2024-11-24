'use client';

const articles = [
  {
    title: "The Future of African Cinema",
    excerpt: "How emerging filmmakers are revolutionizing storytelling through digital innovation.",
    category: "Film",
    readTime: "5 min read"
  },
  {
    title: "Fusion Fashion: Traditional Meets Modern",
    excerpt: "African designers creating waves in the global fashion industry with unique perspectives.",
    category: "Fashion",
    readTime: "4 min read"
  },
  {
    title: "Digital Art Revolution",
    excerpt: "African digital artists pushing boundaries with NFTs and virtual exhibitions.",
    category: "Culture",
    readTime: "6 min read"
  }
];

export function MagazinePreview() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4 text-text dark:text-text-dark cyberpunk:text-cyber-blue">
              Latest from Our Magazine
            </h2>
            <p className="text-text-secondary dark:text-text-secondary max-w-2xl">
              Exploring the cutting edge of African culture, art, and innovation
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-background-secondary dark:bg-background-secondary-dark cyberpunk:bg-cyber-dark text-primary dark:text-primary-dark cyberpunk:text-cyber-pink font-display rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary-dark cyberpunk:hover:bg-cyber-purple transition-all duration-300">
            View All Articles
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article 
              key={article.title}
              className="group bg-background dark:bg-background-dark cyberpunk:bg-cyber-dark/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-display text-primary dark:text-primary-dark cyberpunk:text-cyber-pink">
                    {article.category}
                  </span>
                  <span className="text-sm text-text-secondary dark:text-text-secondary">
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-text dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-dark cyberpunk:group-hover:text-cyber-blue">
                  {article.title}
                </h3>
                <p className="text-text-secondary dark:text-text-secondary mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-primary dark:text-primary-dark cyberpunk:text-cyber-pink group-hover:translate-x-2 transition-transform">
                  Read More →
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 -right-24 w-48 h-48 bg-primary/5 dark:bg-primary-dark/5 cyberpunk:bg-cyber-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-24 w-64 h-64 bg-secondary/5 dark:bg-secondary-dark/5 cyberpunk:bg-cyber-pink/10 rounded-full blur-3xl"></div>
    </section>
  );
}
