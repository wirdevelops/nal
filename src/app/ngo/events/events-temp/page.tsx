'use client'

import { PageHeader } from '../../components/PageHeader';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';

export default function EventsPage() {
    const { getUpcomingEvents } = useNGOProjectStore();
    const events = getUpcomingEvents();
    
    return (
      <div>
        <PageHeader 
          title="Events" 
          subtitle={`${events.length} upcoming events`} 
        />
        <div className="container mx-auto px-6 py-8">
          {/* Events content here */}
        </div>
      </div>
    );
  }
  