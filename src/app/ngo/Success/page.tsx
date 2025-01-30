'use client'

import { PageHeader } from "../components/PageHeader";
import { useStoryStore } from "@/stores/useStoryStore";

export default function StoriesPage() {
    const { stories } = useStoryStore();
    
    return (
      <div>
        <PageHeader 
          title="Success Stories" 
          subtitle={`${stories.length} stories shared`} 
        />
        <div className="container mx-auto px-6 py-8">
          {/* Stories  content here */}
        </div>
      </div>
    );
  }