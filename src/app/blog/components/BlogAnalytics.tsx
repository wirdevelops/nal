'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, Clock, BarChart2, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogAnalyticsProps {
  posts: BlogPost[];
  published: BlogPost[];
  drafts: BlogPost[];
  scheduled: BlogPost[];
}

export function BlogAnalytics({
  posts,
  published,
  drafts,
  scheduled,
}: BlogAnalyticsProps) {
  // Calculate total views
  const totalViews = posts.reduce(
    (sum, post) => sum + (post.analytics?.views || 0),
    0
  );

  // Calculate average engagement (using arbitrary metrics)
  const calculateEngagement = (post: BlogPost) => {
    const views = post.analytics?.views || 0;
    const timeOnPage = post.analytics?.averageTimeOnPage || 0;
    const shares = Object.values(post.analytics?.shares || {}).reduce((a, b) => a + b, 0);
    return views * 0.4 + timeOnPage * 0.4 + shares * 0.2;
  };

  const averageEngagement = published.length
    ? published.reduce((sum, post) => sum + calculateEngagement(post), 0) / published.length
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{posts.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {published.length} published · {drafts.length} drafts
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {(totalViews / Math.max(published.length, 1)).toFixed(0)} avg. per post
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scheduled.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {scheduled.length > 0 
              ? 'Posts scheduled for publication'
              : 'No scheduled posts'
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageEngagement.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            From {published.length} published posts
          </div>
        </CardContent>
      </Card>
    </div>
  );
}