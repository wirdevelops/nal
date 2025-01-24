import { useRouter } from 'next/router';
import { 
  LayoutDashboard, FolderKanban, Users, 
  HeartHandshake, BookOpen, BarChart 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/ngo', icon: LayoutDashboard },
  { name: 'Projects', href: '/ngo/projects', icon: FolderKanban },
  { name: 'Impact', href: '/ngo/impact', icon: BarChart },
  { name: 'Volunteers', href: '/ngo/volunteers', icon: Users },
  { name: 'Donations', href: '/ngo/donations', icon: HeartHandshake },
  { name: 'Stories', href: '/ngo/stories', icon: BookOpen }
];

export default function NGONavigation() {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </a>
        );
      })}
    </nav>
  );
}