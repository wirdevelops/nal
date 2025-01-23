'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
Search, Plus, Filter, Users, Video, Mail,
Grid, List, LayoutList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProjectStore } from '@/stores/useProjectStore';
import { AddMemberDialog } from './components/AddMemberDialog';
import { CreateAuditionDialog } from './components/CreateAuditionDialog';

const castMembers = [
{
id: '1',
name: 'John Doe',
role: 'Lead Actor',
status: 'Confirmed',
imageUrl: '/api/placeholder/40/40'
},
{
id: '2',
name: 'Jane Smith',
role: 'Supporting',
status: 'In Consideration',
imageUrl: '/api/placeholder/40/40'
},
{
id: '3',
name: 'Mike Johnson',
role: 'Lead Actor',
status: 'Pending',
imageUrl: '/api/placeholder/40/40'
},
] as const;

const crewMembers = [
{
id: '1',
name: 'Sarah Wilson',
role: 'Director of Photography',
department: 'Camera',
status: 'Active',
imageUrl: '/api/placeholder/40/40'
},
{
id: '2',
name: 'James Brown',
role: 'Production Designer',
department: 'Art',
status: 'Active',
imageUrl: '/api/placeholder/40/40'
},
{
id: '3',
name: 'Emily Davis',
role: 'Sound Engineer',
department: 'Sound',
status: 'Active',
imageUrl: '/api/placeholder/40/40'
},
] as const;

const upcomingAuditions = [
{
id: '1',
role: 'Lead Actor',
date: '2025-01-25',
time: '10:00 AM',
location: 'Studio A',
applicants: 12,
status: 'Scheduled'
},
{
id: '2',
role: 'Supporting Role',
date: '2025-01-26',
time: '2:00 PM',
location: 'Studio B',
applicants: 8,
status: 'Scheduled'
},
] as const;

// Quick action cards for casting management
const QuickActions = () => (

  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
        <Users className="h-8 w-8 text-blue-600" />
        <div className="space-y-1">
          <h3 className="font-medium">Add Member</h3>
          <p className="text-sm text-muted-foreground">Add cast or crew member</p>
        </div>
      </CardContent>
    </Card>
    {/* ... other quick action cards ... */}
  </div>
);
export default function CastingPage({ params }) {
const router = useRouter();
const { projects } = useProjectStore();
const project = projects.find(p => p.id === params.projectId);

const [searchQuery, setSearchQuery] = useState('');
const [viewLayout, setViewLayout] = useState('grid');
const [addMemberOpen, setAddMemberOpen] = useState(false);
const [createAuditionOpen, setCreateAuditionOpen] = useState(false);

if (!project) {
router.push('/projects');
return null;
}

return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
<div>
<h1 className="text-3xl font-bold">Cast & Crew</h1>
<p className="text-muted-foreground">Manage your production team and talent</p>
</div>
<div className="flex gap-2">
<Button onClick={() => setCreateAuditionOpen(true)}>
Schedule Audition
</Button>
<Button onClick={() => setAddMemberOpen(true)}>
Add Member
</Button>
</div>
</div>

{/* Search and Filters */}
  <div className="flex flex-col md:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setViewLayout(viewLayout === 'grid' ? 'list' : 'grid')}
      >
        {viewLayout === 'grid' ? (
          <LayoutList className="h-4 w-4" />
        ) : (
          <Grid className="h-4 w-4" />
        )}
      </Button>
    </div>
  </div>

  {/* Main Content */}
  <Tabs defaultValue="cast" className="space-y-4">
    <TabsList>
      <TabsTrigger value="cast">Cast</TabsTrigger>
      <TabsTrigger value="crew">Crew</TabsTrigger>
      <TabsTrigger value="auditions">Auditions</TabsTrigger>
    </TabsList>

    {/* Tab Content */}
    <TabsContent value="cast" className="space-y-4">
      <div className={cn(
        "grid gap-4",
        viewLayout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
      )}>
        {castMembers.map(member => (
          <Card key={member.id} className={cn(
            "hover:shadow-md transition-shadow",
            viewLayout === 'list' && 'flex flex-row'
          )}>
            <CardContent className={cn(
              "p-4",
              viewLayout === 'list' && 'flex items-center gap-4 w-full'
            )}>
              {viewLayout === 'list' && (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div className={cn(
                "flex flex-col gap-1",
                viewLayout === 'list' && 'flex-1'
              )}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{member.name}</h3>
                  <Badge variant={member.status === 'Confirmed' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>

    <TabsContent value="crew" className="space-y-4">
      <div className={cn(
        "grid gap-4",
        viewLayout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
      )}>
        {crewMembers.map(member => (
          <Card key={member.id} className={cn(
            "hover:shadow-md transition-shadow",
            viewLayout === 'list' && 'flex flex-row'
          )}>
            <CardContent className={cn(
              "p-4",
              viewLayout === 'list' && 'flex items-center gap-4 w-full'
            )}>
              {viewLayout === 'list' && (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div className={cn(
                "flex flex-col gap-1",
                viewLayout === 'list' && 'flex-1'
              )}>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <Badge variant="outline" className="w-fit">
                  {member.department}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>

    <TabsContent value="auditions" className="space-y-4">
      <div className={cn(
        "grid gap-4",
        viewLayout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
      )}>
        {upcomingAuditions.map(audition => (
          <Card key={audition.id}>
            <CardHeader>
              <CardTitle className="text-lg">{audition.role}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {audition.date} at {audition.time}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm">{audition.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Applicants</span>
                    <span className="text-sm">{audition.applicants}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage Slots
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  </Tabs>

  {/* Dialogs */}
  <AddMemberDialog 
    open={addMemberOpen} 
    onOpenChange={setAddMemberOpen}
    projectId={params.projectId}
  />
  <CreateAuditionDialog 
    open={createAuditionOpen} 
    onOpenChange={setCreateAuditionOpen}
    projectId={params.projectId}
  />
</div>
);
}