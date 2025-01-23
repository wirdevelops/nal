// hooks/blog.ts

import { useState, useCallback } from 'react';
import { useBlogStore } from '@/stores/useBlogStore';
import type { 
  BlogPost, 
  CreatePostData, 
  UpdatePostData, 
  Comment, 
  Category, 
  Tag, 
  PostStatus,
  User 
} from '@/types/blog';

// Hook for managing project's blog posts
export function useProjectBlog(projectId: string) {
  const blogStore = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);

  const createPost = useCallback(async (data: CreatePostData) => {
    setIsLoading(true);
    try {
      return await blogStore.addPost({ ...data, projectId });
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projectId, blogStore]);

  const updatePost = useCallback(async (postId: string, updates: UpdatePostData) => {
    setIsLoading(true);
    try {
      return await blogStore.updatePost(postId, updates);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [blogStore]);

  return {
    posts: blogStore.getProjectPosts(projectId),
    drafts: blogStore.getProjectPosts(projectId, 'draft'),
    published: blogStore.getProjectPosts(projectId, 'published'),
    scheduled: blogStore.getProjectPosts(projectId, 'scheduled'),
    categories: blogStore.categories,
    tags: blogStore.tags,
    isLoading,
    createPost,
    updatePost,
    deletePost: blogStore.deletePost,
    addCategory: blogStore.addCategory,
    addTag: blogStore.addTag,
  };
}

// Hook for managing a single blog post
export function useBlogPost(postId: string) {
  const blogStore = useBlogStore();
  const post = blogStore.getPost(postId);
  const comments = blogStore.getPostComments(postId);
  const [isLoading, setIsLoading] = useState(false);

  const updatePost = useCallback(async (updates: UpdatePostData) => {
    setIsLoading(true);
    try {
      return await blogStore.updatePost(postId, updates);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [postId, blogStore]);

  const addComment = useCallback(async (
    author: Pick<User, 'id' | 'username' | 'fullName' | 'avatar'>,
    data: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'updatedAt' | 'likes' | 'author'>
  ) => {
    setIsLoading(true);
    try {
      return await blogStore.addComment(postId, author, data);
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [postId, blogStore]);

  return {
    post,
    comments,
    isLoading,
    updatePost,
    addComment,
    deletePost: () => blogStore.deletePost(postId),
    incrementViews: () => blogStore.incrementPostViews(postId),
    updateAnalytics: (data: Parameters<typeof blogStore.updatePostAnalytics>[1]) =>
      blogStore.updatePostAnalytics(postId, data),
  };
}

// Hook for managing categories with error handling
export function useCategories() {
  const blogStore = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      return await blogStore.addCategory(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create category');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [blogStore]);

  return {
    categories: blogStore.categories,
    isLoading,
    error,
    createCategory,
    updateCategory: blogStore.updateCategory,
    deleteCategory: blogStore.deleteCategory,
    getPostsByCategory: blogStore.getPostsByCategory,
  };
}

// Hook for managing tags with error handling
export function useTags() {
  const blogStore = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTag = useCallback(async (data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      return await blogStore.addTag(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create tag');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [blogStore]);

  return {
    tags: blogStore.tags,
    isLoading,
    error,
    createTag,
    updateTag: blogStore.updateTag,
    deleteTag: blogStore.deleteTag,
    getPostsByTag: blogStore.getPostsByTag,
  };
}

// Hook for managing comments
export function useComments(postId: string) {
  const blogStore = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addComment = useCallback(async (
    author: Pick<User, 'id' | 'username' | 'fullName' | 'avatar'>,
    data: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'updatedAt' | 'likes' | 'author'>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      return await blogStore.addComment(postId, author, data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add comment');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [postId, blogStore]);

  return {
    comments: blogStore.getPostComments(postId),
    isLoading,
    error,
    addComment,
    updateComment: blogStore.updateComment,
    deleteComment: blogStore.deleteComment,
  };
}

// Hook for searching blog posts
export function useSearchPosts() {
  const blogStore = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback((query: string) => {
    setSearchTerm(query);
    setIsSearching(true);
    setError(null);
    try {
      return blogStore.searchPosts(query);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search posts');
      setError(error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, [blogStore]);

  return {
    searchTerm,
    isSearching,
    error,
    search,
    results: searchTerm ? blogStore.searchPosts(searchTerm) : [],
  };
}