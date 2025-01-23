import { Film, Tv, Video, Music, Camera, Presentation } from 'lucide-react';

export const projectTypes = [
  { 
    id: 'feature',
    label: 'Feature Film',
    icon: Film,
    description: 'Full-length narrative film',
    subTypes: ['Independent', 'Studio', 'Co-production']
  },
  { 
    id: 'short',
    label: 'Short Film',
    icon: Film,
    description: 'Short-form narrative',
    subTypes: ['Fiction', 'Animation', 'Experimental']
  },
  { 
    id: 'series',
    label: 'TV Series',
    icon: Tv,
    description: 'Episodic content',
    subTypes: ['Drama Series', 'Mini Series', 'Web Series', 'Documentary Series']
  },
  { 
    id: 'commercial',
    label: 'Commercial',
    icon: Presentation,
    description: 'Advertising content',
    subTypes: ['TV Commercial', 'Web Commercial', 'Brand Content']
  },
  { 
    id: 'documentary',
    label: 'Documentary',
    icon: Camera,
    description: 'Non-fiction film',
    subTypes: ['Feature Documentary', 'Short Documentary', 'Series']
  },
  { 
    id: 'music_video',
    label: 'Music Video',
    icon: Music,
    description: 'Music-based content',
    subTypes: ['Performance', 'Narrative', 'Lyric Video']
  },
  { 
    id: 'corporate',
    label: 'Corporate',
    icon: Video,
    description: 'Business content',
    subTypes: ['Training', 'Promotional', 'Event Coverage']
  }
];