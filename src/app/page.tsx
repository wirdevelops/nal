'use client';

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Icons } from '@/components/ui/Icons'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { featuredCategories, blogPosts, creators, testimonials, impactStats, foundationInitiatives, featuredPodcasts } from '@/data/content'
import { AuthButtons } from '@/components/auth/auth-buttons'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const ScrollReveal = dynamic(() => import('@/components/ui/ScrollReveal').then(mod => mod.ScrollReveal), {
  ssr: false
})

const HoverCard = dynamic(() => import('@/components/ui/HoverCard').then(mod => mod.HoverCard), {
  ssr: false
})

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Diagonal Split */}
      <section className="relative min-h-[85vh] md:h-[90vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Image
            src="/images/hero/hero-bg.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover object-[center_30%] md:object-center"
            sizes="100vw"
            quality={85}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background dark:from-transparent dark:via-zinc-900/90 dark:to-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col">
          <div className="flex-1 min-h-[60vh] md:min-h-0" />
          <div className="max-w-3xl space-y-4 md:space-y-6 pb-16 md:pb-0">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-7xl font-display font-bold text-white dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Where African Culture Meets Innovation
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/90 dark:text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Empowering voices, sharing stories, and building communities through digital innovation
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AuthButtons />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Categories */}
      <ScrollReveal>
        <Section variant="default">
          <Container>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {featuredCategories.map((category) => (
                <motion.div key={category.title} variants={item}>
                  <HoverCard>
                    <Link
                      href={category.href}
                      className={`block p-8 rounded-2xl bg-muted/50 transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <div className="mb-6">
                        <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary to-primary/60">
                          {(() => {
                            const Icon = Icons[category.icon as keyof typeof Icons];
                            return <Icon className="h-6 w-6 text-white" />;
                          })()}
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-medium mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <div className="mt-6 flex items-center text-sm font-medium text-primary">
                        Learn more
                        <Icons.arrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </Link>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Latest Blog Posts */}
      <ScrollReveal>
        <Section variant="muted">
          <Container>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-display font-medium">Latest Stories</h2>
              <Button variant="link">
                <Link href="/blog" className="inline-flex items-center">
                  View all posts
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {blogPosts.map((post, index) => (
                <motion.div key={post.title} variants={item}>
                  <HoverCard>
                    <Card>
                      <div className="aspect-w-16 aspect-h-9 bg-muted relative">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <time className="text-sm text-muted-foreground">{post.date}</time>
                        </div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="link">
                          <Link href={`/blog/${post.slug}`} className="inline-flex items-center">
                            Read more
                            <Icons.arrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Impact Statistics */}
      <ScrollReveal>
        <Section variant="default">
          <Container>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {impactStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="p-6 rounded-2xl bg-muted/50"
                >
                  <div className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                  <div className="text-sm text-muted-foreground mt-2">{stat.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Featured Content Creators */}
      <ScrollReveal>
        <Section variant="muted">
          <Container>
            <SectionHeader
              title="Meet Our Creators"
              description="Discover the talented voices shaping African digital culture and storytelling"
              align="center"
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {creators.map((creator) => (
                <motion.div key={creator.name} variants={item}>
                  <HoverCard>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <Image
                            src={creator.image}
                            alt={creator.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="128px"
                            quality={85}
                          />
                        </div>
                        <CardTitle className="mb-2">{creator.name}</CardTitle>
                        <CardDescription>{creator.role}</CardDescription>
                      </CardContent>
                      <CardFooter className="justify-center space-x-4">
                        {creator.social.twitter && (
                          <Button variant="ghost" size="sm">
                            <Link href={creator.social.twitter}>Twitter</Link>
                          </Button>
                        )}
                        {creator.social.instagram && (
                          <Button variant="ghost" size="sm">
                            <Link href={creator.social.instagram}>Instagram</Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal>
        <Section variant="default">
          <Container>
            <SectionHeader
              title="What Our Community Says"
              description="Hear from members who are part of our growing community"
              align="center"
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {testimonials.map((testimonial) => (
                <motion.div key={testimonial.author} variants={item}>
                  <HoverCard>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="relative w-12 h-12">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.author}
                              fill
                              className="rounded-full object-cover"
                              sizes="48px"
                              quality={85}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base">{testimonial.author}</CardTitle>
                            <CardDescription>{testimonial.role}</CardDescription>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                      </CardContent>
                    </Card>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Foundation Initiatives Section */}
      <Section className="bg-muted/50">
        <Container>
          <SectionHeader
            title="Na Level Foundation"
            description="Empowering African youth through creativity, technology, and education"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {foundationInitiatives.map((initiative) => (
              <ScrollReveal key={initiative.id}>
                <Card className="group hover:shadow-xl transition-all duration-300">
                  <CardContent>
                    <div className="relative mb-4 aspect-video">
                      <Image
                        src={initiative.image}
                        alt={initiative.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      {/* {Icons[initiative.icon as keyof typeof Icons]} */}
                      <span className="text-sm font-medium">{initiative.category}</span>
                    </div>
                    <CardTitle>{initiative.title}</CardTitle>
                    <CardDescription>{initiative.description}</CardDescription>
                    <div className="mt-6">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{initiative.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${initiative.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Support Initiative
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              View All Initiatives
            </Button>
          </div>
        </Container>
      </Section>

      {/* Podcasts Section */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                title="Na Level Podcasts"
                description="Listen to inspiring stories, discussions, and insights from African creators and innovators"
                className="text-left"
              />
              <div className="mt-8 space-y-6">
                {featuredPodcasts.map((podcast) => (
                  <ScrollReveal key={podcast.id}>
                    <Card className="group hover:bg-muted/50 transition-all duration-300">
                      <CardContent className="flex gap-4 p-4">
                        <div className="relative shrink-0 w-24 h-24">
                          <Image
                            src={podcast.image}
                            alt={podcast.title}
                            fill
                            className="rounded-lg object-cover"
                            sizes="96px"
                            quality={85}
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icons.play size="sm" className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm text-primary font-medium">
                              {podcast.category}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {podcast.duration}
                            </div>
                          </div>
                          <CardTitle className="mb-2">{podcast.title}</CardTitle>
                          <div className="flex items-center gap-3">
                            <div className="relative w-6 h-6">
                              <Image
                                src={podcast.host.avatar}
                                alt={podcast.host.name}
                                fill
                                className="rounded-full"
                                sizes="24px"
                                quality={85}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {podcast.host.name}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore All Episodes
                </Button>
              </div>
            </div>
            <ScrollReveal  className="hidden lg:block">
              <div className="relative">
                <Image
                  src="/images/home/podcast-feature.jpg"
                  alt="Na Level Podcasts"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 600px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-bold mb-4">
                      Share Your Story
                    </h3>
                    <p className="text-white/80 mb-6">
                      Join our podcast as a guest and share your creative journey with our community
                    </p>
                    <Button variant="secondary" size="lg">
                      Apply as Guest
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Newsletter Subscription */}
      <ScrollReveal>
        <Section variant="muted">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <SectionHeader
                title="Stay Updated"
                description="Subscribe to our newsletter for the latest stories, events, and opportunities"
                align="center"
              />
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-input"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </Container>
        </Section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal>
        <Section variant="default" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start sharing your story and connect with creators across Africa
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Link href="/sign-up">
                    Get Started
                    <Icons.arrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </ScrollReveal>
    </div>
  )
}