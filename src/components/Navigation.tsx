'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Explore',
    href: '#',
    children: [
      { name: 'Blog', href: '/blog' },
      { name: 'Events', href: '/events' },
      { name: 'Projects', href: '/projects' },
      { name: 'Jobs', href: '/jobs' },
    ],
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent',
        isScrolled && 'border-b border-border shadow-sm'
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn(
              "text-xl font-display font-bold",
              isScrolled
                ? "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent dark:from-white dark:to-white/90"
            )}>
              Na Level
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative" ref={dropdownRef}>
                {item.children ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    className={cn(
                      "flex items-center space-x-1 text-sm font-medium transition-colors",
                      isScrolled
                        ? "text-foreground hover:text-foreground/80"
                        : "text-white hover:text-white/80 dark:text-white dark:hover:text-white/80"
                    )}
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.name && "transform rotate-180"
                      )} 
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isScrolled
                        ? "text-foreground hover:text-foreground/80"
                        : "text-white hover:text-white/80 dark:text-white dark:hover:text-white/80"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 rounded-xl bg-popover shadow-lg ring-1 ring-black/10 dark:ring-white/20"
                      >
                        <div className="py-1">
                          {item.children.map((child) => (
                            <motion.div
                              key={child.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href={child.href}
                                className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Theme Toggles */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isScrolled
                    ? "hover:bg-muted text-foreground/80 hover:text-foreground"
                    : "hover:bg-white/10 text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white",
                  theme === 'light' && "bg-muted text-foreground"
                )}
                aria-label="Light theme"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isScrolled
                    ? "hover:bg-muted text-foreground/80 hover:text-foreground"
                    : "hover:bg-white/10 text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white",
                  theme === 'dark' && "bg-muted text-foreground"
                )}
                aria-label="Dark theme"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isScrolled
                    ? "hover:bg-muted text-foreground/80 hover:text-foreground"
                    : "hover:bg-white/10 text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white",
                  theme === 'system' && "bg-muted text-foreground"
                )}
                aria-label="System theme"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>

            {/* CTA Button */}
            <Link
              href="/sign-up"
              className={cn(
                "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-all",
                isScrolled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
              )}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled
                ? "hover:bg-muted text-foreground/80 hover:text-foreground"
                : "hover:bg-white/10 text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white"
            )}
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          {item.name}
                          <ChevronDown 
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              activeDropdown === item.name && "transform rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-muted/50"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="block px-8 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setIsOpen(false);
                                  }}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-4 py-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Theme</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setTheme('light')}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors",
                          theme === 'light' && "bg-muted text-foreground"
                        )}
                      >
                        <Sun className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors",
                          theme === 'dark' && "bg-muted text-foreground"
                        )}
                      >
                        <Moon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors",
                          theme === 'system' && "bg-muted text-foreground"
                        )}
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
