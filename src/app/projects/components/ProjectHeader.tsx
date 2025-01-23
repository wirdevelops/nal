import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Clock, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export function ProjectHeader({ project }) {
  const router = useRouter();
  const startDate = project.startDate ? new Date(project.startDate) : null;
  const targetDate = project.targetDate ? new Date(project.targetDate) : null;

  return (
    <Card className="border-0 shadow-none bg-transparent ">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-muted">
            <img 
              src="/api/placeholder/192/192" 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge 
              className="absolute bottom-2 left-2" 
              variant="secondary"
            >
              {project.type}
            </Badge>
          </div>

          {/* Project Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  {project.title}
                </h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/projects/${project.id}/settings`)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
              <p className="text-muted-foreground mt-2">
                {project.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Timeline
                </div>
                <p className="font-medium">
                  {startDate ? format(startDate, 'MMM d, yyyy') : 'Not set'} 
                  {targetDate ? ` - ${format(targetDate, 'MMM d, yyyy')}` : ''}
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Team
                </div>
                <p className="font-medium">{project.team} members</p>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={
                  project.status === 'active' ? 'default' :
                  project.status === 'completed' ? 'secondary' : 'outline'
                }>
                  {project.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Phase</div>
                <Badge variant="outline">{project.phase}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// import React from 'react';
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Settings, Clock, Calendar, Users } from 'lucide-react';
// import { format } from 'date-fns';

// export function ProjectHeader({ project }) {
//   const startDate = project.startDate ? new Date(project.startDate) : null;
//   const targetDate = project.targetDate ? new Date(project.targetDate) : null;

//   return (
//     <Card className="border-0 shadow-none bg-transparent">
//       <CardContent className="p-0">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Thumbnail */}
//           <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-muted">
//             <img 
//               src="/api/placeholder/192/192" 
//               alt={project.title} 
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//             <Badge 
//               className="absolute bottom-2 left-2" 
//               variant="secondary"
//             >
//               {project.type}
//             </Badge>
//           </div>

//           {/* Project Info */}
//           <div className="flex-1 space-y-4">
//             <div>
//               <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold tracking-tight">
//                   {project.title}
//                 </h1>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                  // onClick={onSettingsClick}
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Settings
//                 </Button>
//               </div>
//               <p className="text-muted-foreground mt-2">
//                 {project.description}
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//               <div className="space-y-1">
//                 <div className="text-sm text-muted-foreground flex items-center">
//                   <Clock className="w-4 h-4 mr-1" />
//                   Timeline
//                 </div>
//                 <p className="font-medium">
//                   {startDate ? format(startDate, 'MMM d, yyyy') : 'Not set'} 
//                   {targetDate ? ` - ${format(targetDate, 'MMM d, yyyy')}` : ''}
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <div className="text-sm text-muted-foreground flex items-center">
//                   <Users className="w-4 h-4 mr-1" />
//                   Team
//                 </div>
//                 <p className="font-medium">{project.team} members</p>
//               </div>
//               <div className="space-y-1">
//                 <div className="text-sm text-muted-foreground">Status</div>
//                 <Badge variant={
//                   project.status === 'active' ? 'default' :
//                   project.status === 'completed' ? 'secondary' : 'outline'
//                 }>
//                   {project.status}
//                 </Badge>
//               </div>
//               <div className="space-y-1">
//                 <div className="text-sm text-muted-foreground">Phase</div>
//                 <Badge variant="outline">{project.phase}</Badge>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }