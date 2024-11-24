import { Metadata } from "next"
import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export const metadata: Metadata = {
  title: "Community | Na Level Empire",
  description: "Join our vibrant community of African creators, innovators, and changemakers.",
}

export default function CommunityPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <Section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent dark:from-black/80 dark:via-black/60 dark:to-transparent">
          <motion.div
            className="absolute inset-0 bg-[url('/images/community/community-hero.jpg')] bg-cover bg-center"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-white max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Join Our Creative Community
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Connect with fellow African creators, share your work, and be part of a movement that's reshaping the creative landscape.
            </p>
            <Button size="lg" variant="primary">
              Join Now
            </Button>
          </motion.div>
        </Container>
      </Section>

      {/* Featured Communities Section */}
      <Section>
        <Container>
          <SectionHeader
            title="Creative Communities"
            description="Explore our diverse communities focused on different aspects of African creativity"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {communities.map((community) => (
              <ScrollReveal key={community.id}>
                <Card>
                  <Card.Image src={community.image} alt={community.name} />
                  <Card.Content>
                    <Card.Title>{community.name}</Card.Title>
                    <Card.Description>{community.description}</Card.Description>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {community.members} members
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                  </Card.Content>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Upcoming Events Section */}
      <Section className="bg-muted/50">
        <Container>
          <SectionHeader
            title="Upcoming Events"
            description="Join our virtual and physical events to connect, learn, and grow"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {events.map((event) => (
              <ScrollReveal key={event.id}>
                <Card className="flex flex-col md:flex-row gap-6">
                  <Card.Image 
                    src={event.image} 
                    alt={event.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                  <Card.Content>
                    <div className="text-sm text-primary mb-2">{event.date}</div>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Description>{event.description}</Card.Description>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">Register Now</Button>
                    </div>
                  </Card.Content>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Community Highlights Section */}
      <Section>
        <Container>
          <SectionHeader
            title="Community Highlights"
            description="Featured projects and achievements from our community members"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {highlights.map((highlight) => (
              <ScrollReveal key={highlight.id}>
                <Card>
                  <Card.Image src={highlight.image} alt={highlight.title} />
                  <Card.Content>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={highlight.creator.avatar}
                        alt={highlight.creator.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-sm font-medium">
                        {highlight.creator.name}
                      </div>
                    </div>
                    <Card.Title>{highlight.title}</Card.Title>
                    <Card.Description>{highlight.description}</Card.Description>
                  </Card.Content>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Community Guidelines Section */}
      <Section className="bg-muted/50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                title="Community Guidelines"
                description="Our values and principles that keep our community vibrant and inclusive"
                className="text-left"
              />
              <ul className="mt-8 space-y-4">
                {guidelines.map((guideline) => (
                  <ScrollReveal key={guideline.id}>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {guideline.icon}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{guideline.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {guideline.description}
                        </p>
                      </div>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
            </div>
            <ScrollReveal>
              <img
                src="/images/community/guidelines.jpg"
                alt="Community Guidelines"
                className="rounded-lg shadow-2xl"
              />
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="bg-primary text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <SectionHeader
              title="Ready to Join Our Community?"
              description="Be part of a movement that's reshaping African creativity and innovation"
              className="text-white [&>h2]:text-white [&>p]:text-white/80"
            />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Join Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}

const communities = [
  {
    id: 1,
    name: "Digital Artists Collective",
    description: "A space for African digital artists to share work, collaborate, and grow together.",
    image: "/images/community/digital-art.jpg",
    members: 1240
  },
  {
    id: 2,
    name: "Tech Innovators Hub",
    description: "Connect with fellow African tech entrepreneurs and developers.",
    image: "/images/community/tech.jpg",
    members: 890
  },
  {
    id: 3,
    name: "Music Creators Network",
    description: "For musicians, producers, and everyone involved in African music creation.",
    image: "/images/community/music.jpg",
    members: 1560
  },
  {
    id: 4,
    name: "Fashion & Design Circle",
    description: "Celebrating African fashion, from traditional to contemporary designs.",
    image: "/images/community/fashion.jpg",
    members: 920
  },
  {
    id: 5,
    name: "Content Creators United",
    description: "A community for African YouTubers, podcasters, and digital content creators.",
    image: "/images/community/content.jpg",
    members: 1100
  },
  {
    id: 6,
    name: "Visual Storytellers",
    description: "Photography, cinematography, and visual arts community.",
    image: "/images/community/visual.jpg",
    members: 780
  }
]

const events = [
  {
    id: 1,
    title: "African Digital Art Festival",
    description: "A virtual showcase of the best digital art from across the continent.",
    date: "March 15-17, 2024",
    image: "/images/community/event-art.jpg"
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    description: "Connect with leading African tech innovators and entrepreneurs.",
    date: "April 5-6, 2024",
    image: "/images/community/event-tech.jpg"
  },
  {
    id: 3,
    title: "Music Production Masterclass",
    description: "Learn from top African music producers and sound engineers.",
    date: "April 20, 2024",
    image: "/images/community/event-music.jpg"
  },
  {
    id: 4,
    title: "Content Creator Workshop",
    description: "Essential skills for creating engaging digital content.",
    date: "May 1, 2024",
    image: "/images/community/event-content.jpg"
  }
]

const highlights = [
  {
    id: 1,
    title: "Afrofuturistic Digital Art Series",
    description: "A stunning collection blending traditional African motifs with futuristic elements.",
    image: "/images/community/highlight-art.jpg",
    creator: {
      name: "Chioma A.",
      avatar: "/images/community/avatar-1.jpg"
    }
  },
  {
    id: 2,
    title: "Innovative Fintech Solution",
    description: "A revolutionary mobile payment system designed for African markets.",
    image: "/images/community/highlight-tech.jpg",
    creator: {
      name: "Kwame B.",
      avatar: "/images/community/avatar-2.jpg"
    }
  },
  {
    id: 3,
    title: "Contemporary African Music Album",
    description: "A groundbreaking fusion of traditional and modern African sounds.",
    image: "/images/community/highlight-music.jpg",
    creator: {
      name: "Amara K.",
      avatar: "/images/community/avatar-3.jpg"
    }
  }
]

const guidelines = [
  {
    id: 1,
    title: "Respect & Inclusivity",
    description: "Embrace diversity and maintain respectful dialogue within the community.",
    icon: "🤝"
  },
  {
    id: 2,
    title: "Authentic Creation",
    description: "Share original work and respect intellectual property rights.",
    icon: "✨"
  },
  {
    id: 3,
    title: "Collaborative Spirit",
    description: "Support fellow creators and participate in community initiatives.",
    icon: "🌟"
  },
  {
    id: 4,
    title: "Cultural Appreciation",
    description: "Celebrate and preserve African cultural heritage in creative work.",
    icon: "🌍"
  }
]
