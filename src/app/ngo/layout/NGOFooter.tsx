
// src/ngo/layout/NGOFooter.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart 
} from 'lucide-react';

export function NGOFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">About Us</h3>
            <p className="text-sm text-muted-foreground">
              Making a difference in communities through impactful projects and dedicated volunteers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ngo/projects" className="text-muted-foreground hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/ngo/volunteer" className="text-muted-foreground hover:text-foreground">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/ngo/impact" className="text-muted-foreground hover:text-foreground">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link href="/ngo/events" className="text-muted-foreground hover:text-foreground">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ngo/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/ngo/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/ngo/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/ngo/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates on our projects and impact.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Our Community
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            © {new Date().getFullYear()} NGO Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
