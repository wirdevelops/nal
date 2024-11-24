import './globals.css'
import { Inter, Poppins, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { AuthProvider } from '@/components/providers/auth-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata = {
  title: 'Na Level Empire',
  description: 'African Culture × Future Vision - A platform for cultural expression and community empowerment',
}

const socialIcons = [
  { name: 'Facebook', href: '#', Icon: Facebook },
  { name: 'Twitter', href: '#', Icon: Twitter },
  { name: 'Instagram', href: '#', Icon: Instagram },
  { name: 'YouTube', href: '#', Icon: Youtube },
] as const;

const footerNavigation = {
  solutions: [
    { name: 'Blog', href: '/blog' },
    { name: 'Events', href: '/events' },
    { name: 'Projects', href: '/projects' },
    { name: 'Jobs', href: '/jobs' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Partners', href: '/partners' },
    { name: 'Careers', href: '/careers' },
  ],
  social: socialIcons,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen bg-background text-foreground">
              <Navigation />
              <main className="flex-1">{children}</main>
              <footer className="bg-background border-t">
                <div className="container mx-auto px-4 py-12 lg:py-16">
                  <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand */}
                    <div className="space-y-8 xl:col-span-1">
                      <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Na Level
                        </span>
                      </Link>
                      <p className="text-base text-muted-foreground max-w-md">
                        Empowering African voices through digital innovation. Join us in celebrating culture,
                        creativity, and community.
                      </p>
                      <div className="flex space-x-6">
                        {socialIcons.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span className="sr-only">{item.name}</span>
                            <item.Icon className="h-6 w-6" aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                      <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Solutions</h3>
                          <ul role="list" className="mt-4 space-y-4">
                            {footerNavigation.solutions.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-10 md:mt-0">
                          <h3 className="text-sm font-semibold text-foreground">Support</h3>
                          <ul role="list" className="mt-4 space-y-4">
                            {footerNavigation.support.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Company</h3>
                          <ul role="list" className="mt-4 space-y-4">
                            {footerNavigation.company.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-10 md:mt-0">
                          <h3 className="text-sm font-semibold text-foreground">Subscribe to our newsletter</h3>
                          <p className="mt-4 text-base text-muted-foreground">
                            Get weekly updates on the latest stories, events, and special offers.
                          </p>
                          <form className="mt-4">
                            <div className="flex gap-2">
                              <label htmlFor="email-address" className="sr-only">
                                Email address
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email-address"
                                autoComplete="email"
                                required
                                className="w-full min-w-0 flex-auto rounded-md border-0 bg-muted/50 px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-foreground/5 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Enter your email"
                              />
                              <button
                                type="submit"
                                className="flex-none rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              >
                                Subscribe
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="mt-16 border-t pt-8">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} Na Level Empire. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
