import { 
  Laptop,
  Music,
  Palette,
  Shirt,
  ArrowRight,
  Play,
  Newspaper,
  Calendar,
  Briefcase,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  type LucideIcon,
  type LucideProps
} from 'lucide-react';

export type Icon = LucideIcon;

type IconsType = {
  [key: string]: React.FC<LucideProps>;
};

export const Icons: IconsType = {
  laptop: Laptop,
  music: Music,
  palette: Palette,
  shirt: Shirt,
  arrowRight: ArrowRight,
  play: Play,
  newspaper: Newspaper,
  calendar: Calendar,
  briefcase: Briefcase,
  users: Users,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

export type IconName = keyof typeof Icons;
