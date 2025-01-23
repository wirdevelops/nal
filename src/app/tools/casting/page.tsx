'use client'

import React, { useState } from 'react';
import { 
    Users, Plus, Search, Filter, UserPlus, Calendar,
    Video, ClipboardList, Mail, Upload, ChevronDown,
    Menu, X, ArrowLeft, MoreVertical, Home, LayoutList, Grid, List, Bell
  } from 'lucide-react';
  import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AddMemberDialog } from './components/AddMemberDialog';
import { CreateAuditionDialog } from './components/CreateAuditionDialog';
import { cn } from '@/lib/utils';


// Project Switcher Component
const ProjectSwitcher = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            <span>The Last Summer</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Winter's Tale</DropdownMenuItem>
          <DropdownMenuItem>City Lights</DropdownMenuItem>
          <DropdownMenuItem>New Project...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Navigation Breadcrumbs
const Breadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          <Home className="h-4 w-4" />
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <span className="text-foreground">Cast & Crew</span>
      </div>
    );
  };

  // Quick Stats Component
const QuickStats = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Cast Members</div>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Crew Members</div>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Upcoming Auditions</div>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main Tool Navigation
const ToolNav = () => {
    return (
      <nav className="flex space-x-4">
        <Link href="/tools/script">
          <Button variant="ghost" size="sm">Script</Button>
        </Link>
        <Link href="/tools/moodboard">
          <Button variant="ghost" size="sm">Moodboard</Button>
        </Link>
        <Link href="/tools/casting" className="border-b-2 border-primary">
          <Button variant="ghost" size="sm">Cast & Crew</Button>
        </Link>
        <Link href="/tools/budget">
          <Button variant="ghost" size="sm">Budget</Button>
        </Link>
      </nav>
    );
  };

  // Mobile Navigation Toggle
const MobileNav = ({ onToggle }) => {
    return (
      <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
    );
  };

  // Mobile Side Navigation
const MobileSideNav = ({ isOpen, onClose }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-background border-r shadow-md p-4 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Navigation</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex flex-col gap-2">
          <Link href="/tools/script">
          <Button variant="ghost" size="sm" className="w-full justify-start">
              Script
            </Button>
          </Link>
          <Link href="/tools/moodboard">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Moodboard
            </Button>
          </Link>
          <Link href="/tools/casting" className="border-l-2 border-primary">
          <Button variant="ghost" size="sm" className="w-full justify-start">
              Cast & Crew
            </Button>
          </Link>
          <Link href="/tools/budget">
          <Button variant="ghost" size="sm" className="w-full justify-start">
              Budget
            </Button>
          </Link>
          
        </nav>
      </div>
    </div>
  );
};


// Dummy data for demonstration
const castMembers = [
  { id: 1, name: 'John Doe', role: 'Lead Actor', status: 'Confirmed', imageUrl: '/api/placeholder/40/40' },
  { id: 2, name: 'Jane Smith', role: 'Supporting', status: 'In Consideration', imageUrl: '/api/placeholder/40/40' },
  // Add more dummy data as needed
];

const crewMembers = [
  { id: 1, name: 'Mike Johnson', role: 'Cinematographer', department: 'Camera', imageUrl: '/api/placeholder/40/40' },
  { id: 2, name: 'Sarah Wilson', role: 'Production Designer', department: 'Art', imageUrl: '/api/placeholder/40/40' },
  // Add more dummy data as needed
];

const upcomingAuditions = [
  { id: 1, role: 'Lead Actor', date: '2025-01-25', time: '10:00 AM', location: 'Studio A', applicants: 12 },
  { id: 2, role: 'Supporting Role', date: '2025-01-26', time: '2:00 PM', location: 'Studio B', applicants: 8 },
  // Add more dummy data as needed
];

export default function CastingTool() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('cast');
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [createAuditionOpen, setCreateAuditionOpen] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showSideNav, setShowSideNav] = useState(true);
    const [viewLayout, setViewLayout] = useState('grid'); // 'grid' or 'list'

  const handleAddNew = () => {
    setAddMemberOpen(true);
  };

  const handleCreateAudition = () => {
    setCreateAuditionOpen(true);
  };

  const QuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <div className="space-y-1">
            <h3 className="font-medium">Add Member</h3>
            <p className="text-sm text-muted-foreground">Add cast or crew member</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <Calendar className="h-8 w-8 text-green-600" />
          <div className="space-y-1">
            <h3 className="font-medium">Schedule Audition</h3>
            <p className="text-sm text-muted-foreground">Create audition slots</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <Video className="h-8 w-8 text-purple-600" />
          <div className="space-y-1">
            <h3 className="font-medium">Video Submissions</h3>
            <p className="text-sm text-muted-foreground">Review recorded auditions</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <Mail className="h-8 w-8 text-red-600" />
          <div className="space-y-1">
            <h3 className="font-medium">Send Updates</h3>
            <p className="text-sm text-muted-foreground">Communicate with team</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-4 flex-1">
            <MobileNav onToggle={() => setShowMobileNav(!showMobileNav)} />
            <ProjectSwitcher />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <MobileSideNav isOpen={showMobileNav} onClose={() => setShowMobileNav(false)} />


      <div className="container py-4">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Tool Navigation */}
        <div className="mt-4">
          <ToolNav />
        </div>

        {/* Main Content Area */}
        <div className="mt-8 space-y-6">
          {/* Hero Section (Optional - can be toggled based on preference) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Cast & Crew Management</h1>
              <p className="text-muted-foreground">Manage your production team and talent</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setCreateAuditionOpen(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Create Audition
              </Button>
              <Button onClick={() => setAddMemberOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <QuickStats />
          
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      {/* Search and Filter Bar */}
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Role</DropdownMenuItem>
              <DropdownMenuItem>Department</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="outline" className="flex gap-2">
               {viewLayout === 'grid' ? <Grid className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
                View
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent>
             <DropdownMenuItem onClick={() => setViewLayout('grid')}>
                <Grid className="w-4 h-4 mr-2"/>
                Grid View
               </DropdownMenuItem>
             <DropdownMenuItem onClick={() => setViewLayout('list')}>
               <List className="w-4 h-4 mr-2"/>
                List View
              </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content */}
      <Tabs defaultValue="cast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cast" onClick={() => setActiveTab('cast')}>Cast</TabsTrigger>
          <TabsTrigger value="crew" onClick={() => setActiveTab('crew')}>Crew</TabsTrigger>
          <TabsTrigger value="auditions" onClick={() => setActiveTab('auditions')}>Auditions</TabsTrigger>
        </TabsList>

        <TabsContent value="cast" className="space-y-4">
          <div className={cn(
            "grid gap-4",
            viewLayout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
          )}>
            {castMembers.map(member => (
              <Card key={member.id} className={cn(viewLayout === 'list' && 'flex flex-row items-center')}>
                <CardContent className={cn("p-4", viewLayout === 'list' && 'flex items-center space-x-4 w-full')}>
                  {viewLayout === 'list' && (
                   <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="rounded-full w-10 h-10"
                   />
                  )}
                 <div className={cn(viewLayout === 'list' ? 'flex-1' : '')}>
                   <div className="flex items-center justify-between">
                    <h3 className="font-medium">{member.name}</h3>
                    {viewLayout === 'grid' && <Badge variant={member.status === 'Confirmed' ? 'default' : 'secondary'}>{member.status}</Badge>}
                   </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  {viewLayout === 'list' && (
                  <Badge variant={member.status === 'Confirmed' ? 'default' : 'secondary'} className="mt-2">
                      {member.status}
                    </Badge>
                    )}
                    
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
             <Card key={member.id} className={cn(viewLayout === 'list' && 'flex flex-row items-center')}>
              <CardContent className={cn("p-4", viewLayout === 'list' && 'flex items-center space-x-4 w-full')}>
               {viewLayout === 'list' && (
                 <img
                  src={member.imageUrl}
                    alt={member.name}
                    className="rounded-full w-10 h-10"
                 />
               )}
                <div className={cn(viewLayout === 'list' ? 'flex-1' : '')}>
                    <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                    <Badge variant="outline" className="mt-1">
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
             <Card key={audition.id} className={cn(viewLayout === 'list' && 'flex flex-col')}>
                <CardHeader>
                    <CardTitle className="text-lg">{audition.role}</CardTitle>
                  <CardDescription>
                      {audition.date} at {audition.time}
                    </CardDescription>
                  </CardHeader>
                 <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                      <span className="font-medium">Location:</span> {audition.location}
                    </p>
                   <p className="text-sm">
                      <span className="font-medium">Applicants:</span> {audition.applicants}
                     </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                     </Button>
                      <Button size="sm">
                        Schedule
                      </Button>
                   </div>
                 </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <AddMemberDialog 
        open={addMemberOpen} 
        onOpenChange={setAddMemberOpen} 
      />
      <CreateAuditionDialog 
        open={createAuditionOpen} 
        onOpenChange={setCreateAuditionOpen} 
      />
    </div>
     </div>
    </div>
  </div>
  );
}

