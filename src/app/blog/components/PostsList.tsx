'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, MoreVertical, Trash, Copy } from 'lucide-react';
import { PostStatus } from '@/types/blog';
import type { BlogPost } from '@/types/blog';

interface PostsListProps {
  posts: BlogPost[];
  isLoading: boolean;
  searchQuery: string;
}

// Status badge variants
const statusVariants: Record<PostStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
  published: { variant: 'default', label: 'Published' },
  draft: { variant: 'secondary', label: 'Draft' },
  scheduled: { variant: 'outline', label: 'Scheduled' },
  archived: { variant: 'destructive', label: 'Archived' }
};

export function PostsList({ posts, isLoading, searchQuery }: PostsListProps) {
  const router = useRouter();

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.excerpt?.toLowerCase().includes(search) ||
      post.author.name.toLowerCase().includes(search)
    );
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading posts...
              </TableCell>
            </TableRow>
          ) : filteredPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{post.title}</div>
                    {post.excerpt && (
                      <div className="text-sm text-muted-foreground truncate max-w-md">
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {post.author.avatar && (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    {post.author.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[post.status].variant}>
                    {statusVariants[post.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {post.categories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {post.publishedAt ? (
                    format(new Date(post.publishedAt), 'MMM d, yyyy')
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {post.analytics?.views?.toLocaleString() || '0'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/blog/posts/${post.id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/blog/editor/${post.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}