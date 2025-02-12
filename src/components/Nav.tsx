// @/components/Nav.tsx
import Link from 'next/link';
import { useAuth } from '@/components/context';

const Navigation = () => {
  const { user } = useAuth();

  const guestLinks = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' }
  ];

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' }
  ];

  const adminLinks = [
    ...userLinks,
    { href: '/admin', label: 'Admin Panel' }
  ];

  const getNavigationLinks = () => {
    if (!user) return guestLinks;
    return user.activeRole === 'admin' ? adminLinks : userLinks;
  };

  return (
    <nav>
      {getNavigationLinks().map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
      {user && <button onClick={() => {/* logout logic */}}>Logout</button>}
    </nav>
  );
};

export default Navigation;