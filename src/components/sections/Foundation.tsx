'use client';

const initiatives = [
  {
    title: "Youth Empowerment",
    description: "Supporting young African creators with resources, mentorship, and platforms for expression.",
    icon: "🌟"
  },
  {
    title: "Cultural Preservation",
    description: "Documenting and digitizing traditional art forms for future generations.",
    icon: "🏺"
  },
  {
    title: "Tech Innovation",
    description: "Bridging the digital divide through technology education and access.",
    icon: "💻"
  },
  {
    title: "Community Development",
    description: "Building sustainable creative spaces in underserved communities.",
    icon: "🏗️"
  }
];

export function Foundation() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-6 text-text dark:text-text-dark cyberpunk:text-cyber-blue">
            Na Level Foundation
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-secondary max-w-2xl mx-auto">
            Empowering communities through cultural innovation and sustainable development initiatives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {initiatives.map((item) => (
            <div 
              key={item.title}
              className="p-6 rounded-xl bg-background-secondary dark:bg-background-secondary-dark cyberpunk:bg-cyber-dark/50 hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-display font-bold mb-3 text-text dark:text-text-dark cyberpunk:text-cyber-pink">
                {item.title}
              </h3>
              <p className="text-text-secondary dark:text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-primary dark:bg-primary-dark cyberpunk:bg-cyber-purple text-white font-display rounded-full hover:bg-secondary dark:hover:bg-secondary-dark cyberpunk:hover:bg-cyber-pink transition-all duration-300">
            Join Our Mission
          </button>
        </div>
      </div>
    </section>
  );
}
