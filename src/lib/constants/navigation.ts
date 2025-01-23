// src/lib/constants/navigation.ts
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    Film, 
    MessageSquare, 
    Briefcase, 
    Heart,
    Settings,
    Shield,
    ScrollText,
    FolderKanban,
    Database,
    Radio,
    Newspaper,
    Portfolio,
    Calendar,
    VideoIcon,
    MessagesSquare,
    Paint,
    Cast,
    Clock,
    Mic2,
    LibraryIcon,
    HandHelping,
    Users2,
    Building,
    BookOpen
  } from "lucide-react"
  
  export type NavigationItem = {
    title: string;
    href: string;
    icon: React.ElementType;
    submenu?: { title: string; href: string }[];
  }
  
  export const adminNavigation: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Collaboration Hub",
      href: "/admin/collaboration",
      icon: Users,
      submenu: [
        { title: "Script Workshop", href: "/admin/collaboration/scripts" },
        { title: "Project Management", href: "/admin/collaboration/projects" },
        { title: "File Management", href: "/admin/collaboration/files" },
      ],
    },
    {
      title: "Content Management",
      href: "/admin/content",
      icon: FileText,
      submenu: [
        { title: "Blog Platform", href: "/admin/content/blog" },
        { title: "Podcast Management", href: "/admin/content/podcast" },
        { title: "Portfolio Showcase", href: "/admin/content/portfolio" },
      ],
    },
    {
      title: "Film Projects",
      href: "/admin/projects",
      icon: Film,
      submenu: [
        { title: "Project Portfolio", href: "/admin/projects/portfolio" },
        { title: "Project Details", href: "/admin/projects/details" },
        { title: "Production Calendar", href: "/admin/projects/calendar" },
        { title: "Location Management", href: "/admin/projects/locations" },
        { title: "Equipment Tracking", href: "/admin/projects/equipment" },
        { title: "Crew Management", href: "/admin/projects/crew" },
      ],
    },
    {
      title: "Communication",
      href: "/admin/communication",
      icon: MessageSquare,
      submenu: [
        { title: "Team Messaging", href: "/admin/communication/messages" },
        { title: "Video Conferencing", href: "/admin/communication/video" },
        { title: "Feedback System", href: "/admin/communication/feedback" },
      ],
    },
    {
      title: "Career Portal",
      href: "/admin/careers",
      icon: Briefcase,
      submenu: [
        { title: "Job Board", href: "/admin/careers/jobs" },
        { title: "Talent Database", href: "/admin/careers/talent" },
        { title: "Applications", href: "/admin/careers/applications" },
      ],
    },
    {
      title: "Casting",
      href: "/admin/casting",
      icon: Cast,
      submenu: [
        { title: "Casting Portal", href: "/admin/casting/portal" },
        { title: "Talent Management", href: "/admin/casting/talent" },
        { title: "Audition System", href: "/admin/casting/auditions" },
        { title: "Role Management", href: "/admin/casting/roles" },
      ],
    },
    {
      title: "NGO Integration",
      href: "/admin/ngo",
      icon: Heart,
      submenu: [
        { title: "Initiative Management", href: "/admin/ngo/initiatives" },
        { title: "Community Engagement", href: "/admin/ngo/community" },
        { title: "Impact Tracking", href: "/admin/ngo/impact" },
        { title: "Volunteer Management", href: "/admin/ngo/volunteers" },
      ],
    },
    {
      title: "Administration",
      href: "/admin/system",
      icon: Settings,
      submenu: [
        { title: "User Management", href: "/admin/system/users" },
        { title: "Role Management", href: "/admin/system/roles" },
        { title: "Permissions", href: "/admin/system/permissions" },
        { title: "Settings", href: "/admin/system/settings" },
      ],
    },
  ]