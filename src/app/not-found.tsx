import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Mail,
  Film,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Return to the homepage"
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Go to your dashboard"
  },
  {
    title: "Features",
    href: "/features",
    icon: Film,
    description: "Explore our features"
  },
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
    description: "Find answers to common questions"
  }
];

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Main Error Message */}
        <div className="text-center space-y-4">
          <div className="text-8xl font-bold text-primary">404</div>
          <h1 className="text-2xl font-semibold">Page Not Found</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Here are some helpful links:
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link href={link.href} key={link.title}>
                <Card className="p-4 hover:shadow-md transition-all flex items-start gap-4 h-full">
                  <div className="rounded-full p-2 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-medium">{link.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/search">
              <Search className="h-4 w-4" />
              Search Site
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/contact">
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Support Text */}
        <p className="text-center text-sm text-muted-foreground">
          If you believe this is a mistake, please{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}