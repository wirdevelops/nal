'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FileText,
  MessageSquare,
  Upload,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Settings,
} from 'lucide-react';

import type { Activity } from '@/types/activity';

interface ActivityFeedProps {
  projectId: string;
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'update':
      return <FileText className="w-4 h-4" />;
    case 'comment':
      return <MessageSquare className="w-4 h-4" />;
    case 'file':
      return <Upload className="w-4 h-4" />;
    case 'status':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'task':
      return <Calendar className="w-4 h-4" />;
    case 'team':
      return <Users className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export function ActivityFeed({ projectId, activities }: ActivityFeedProps) {
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredActivities = activities
    .filter(activity => filter === 'all' || activity.type === filter)
    .slice(0, showAll ? undefined : 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
            All
          </Button>
          <Button 
            variant={filter === 'update' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('update')}
          >
            Updates
          </Button>
          <Button 
            variant={filter === 'comment' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('comment')}
          >
            Comments
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-4 pb-4 border-b last:border-0"
              >
                <Avatar className="w-8 h-8">
                  {activity.user.avatar ? (
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  ) : (
                    <AvatarFallback>
                      {activity.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getActivityIcon(activity.type)}
                      <span className="capitalize">{activity.type}</span>
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {activity.content}
                  </p>

                  {activity.metadata && (
                    <div className="mt-2">
                      {activity.metadata.fileName && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span>{activity.metadata.fileName}</span>
                        </div>
                      )}
                      {activity.metadata.taskName && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{activity.metadata.taskName}</span>
                        </div>
                      )}
                      {activity.metadata.memberName && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {activity.metadata.memberName}
                            {activity.metadata.role && ` - ${activity.metadata.role}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {activities.length > 5 && !showAll && (
          <Button
            variant="link"
            onClick={() => setShowAll(true)}
            className="mt-4 w-full"
          >
            Show All Activities
          </Button>
        )}
      </CardContent>
    </Card>
  );
}