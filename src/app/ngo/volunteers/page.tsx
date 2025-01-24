'use client'

import { PageHeader }from "../components/PageHeader";
import { useVolunteer } from "@/hooks/useVolunteer";

export default function VolunteerPage() {  // Changed to export default
  const { volunteers } = useVolunteer();
  
  return (
    <div>
      <PageHeader 
        title="Volunteer Management" 
        subtitle={`${volunteers.length} active volunteers`} 
      />
      <div className="container mx-auto px-6 py-8">
        {/* Volunteer content here */}
      </div>
    </div>
  );
}