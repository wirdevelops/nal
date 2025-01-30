import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    BlogPost,
    Category,
    Tag,
    Comment,
    CreatePostData,
    UpdatePostData,
    PostStatus,
    User,
    ContentSection,
     Media,
    PostAnalytics
} from '@/types/blog';
import {
    blogPostSchema,
    categorySchema,
    commentSchema,
    postAnalyticsSchema,
    postMetadataSchema
} from '@/utils/blog';

interface BlogStore {
    posts: BlogPost[];
    categories: Category[];
    tags: Tag[];
    comments: Comment[];

    // Post operations
    addPost: (data: CreatePostData) => Promise<BlogPost>;
    updatePost: (id: string, updates: UpdatePostData) => Promise<BlogPost>;
    deletePost: (id: string) => Promise<void>;
    getPost: (id: string) => BlogPost | undefined;
    getPostBySlug: (slug: string) => BlogPost | undefined;

    // Category operations
    addCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Category;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    getCategory: (id: string) => Category | undefined;

    // Tag operations
    addTag: (data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => Tag;
    updateTag: (id: string, updates: Partial<Tag>) => void;
    deleteTag: (id: string) => void;

    // Comment operations
    addComment: (postId: string, author: Pick<User, 'id' | 'username' | 'fullName' | 'avatar'>, data: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'updatedAt' | 'likes' | 'author'>) => Comment;
    updateComment: (id: string, updates: Partial<Comment>) => void;
    deleteComment: (id: string) => void;
    getPostComments: (postId: string) => Comment[];

    // Query operations
    getProjectPosts: (projectId: string, status?: PostStatus) => BlogPost[];
    getPostsByCategory: (categoryId: string) => BlogPost[];
    getPostsByTag: (tagId: string) => BlogPost[];
    searchPosts: (query: string) => BlogPost[];

    // Analytics operations
    incrementPostViews: (postId: string) => void;
    updatePostAnalytics: (postId: string, data: Partial<BlogPost['analytics']>) => Promise<BlogPost>;
}

export const useBlogStore = create<BlogStore>()(
    persist(
        (set, get) => ({
            posts: [],
            categories: [],
            tags: [],
            comments: [],

            addPost: async (data) => {
              try {
                  // Validate post data
                  const validatedData = await blogPostSchema.parseAsync(data);
                  if (!validatedData.author || !validatedData.author.id)
                      throw new Error("Author Id is required");

                  const slug = validatedData.slug || generateSlug(validatedData.title);
                  const existingPostWithSlug = get().posts.find(p => p.slug === slug);
                  if (existingPostWithSlug) {
                      throw new Error("Slug already exists");
                  }

                  const newPost: BlogPost = {
                      id: crypto.randomUUID(),
                      title: validatedData.title,
                      slug: slug,
                      excerpt: validatedData.excerpt,
                       status: validatedData.status,
                       visibility: validatedData.visibility,
                       featuredImage: validatedData.featuredImage ? {
                        id: validatedData.featuredImage.id || crypto.randomUUID(),
                        url: validatedData.featuredImage.url,
                        type: validatedData.featuredImage.type,
                       altText: validatedData.featuredImage.altText,
                        caption: validatedData.featuredImage.caption,
                        uploadedBy: validatedData.featuredImage.uploadedBy,
                        uploadDate: validatedData.featuredImage.uploadDate,
                        metadata: validatedData.featuredImage.metadata,
                      } : undefined,
                      categories: validatedData.categories,
                      tags: validatedData.tags,
                       publishedAt: validatedData.publishedAt,
                      scheduledFor: validatedData.scheduledFor,
                      // Fix author structure to match Pick<User> type
                      author: {
                          id: validatedData.author.id,
                          username: validatedData.author.username || 'unknown',
                          fullName: validatedData.author.fullName || 'Unknown',
                          avatar: validatedData.author.avatar
                      },
                      // Ensure coAuthors follow the same structure
                      coAuthors: validatedData.coAuthors?.map((coAuthor) => ({
                          id: coAuthor.id,
                          username: coAuthor.username || 'unknown',
                          fullName: coAuthor.fullName || 'Unknown',
                          avatar: coAuthor.avatar
                      })),
                      // Ensure content sections have all required fields
                      content: validatedData.content.map((section): ContentSection => ({
                          id: section.id || crypto.randomUUID(),
                          type: section.type,
                          content: section.content,
                          metadata: section.metadata
                      })),
                      metadata: {
                           wordCount: calculateWordCount(
                                validatedData.content.map((section): ContentSection => ({
                                      id: section.id || crypto.randomUUID(),
                                     type: section.type,
                                    content: section.content,
                                   metadata: section.metadata
                                }))
                             ),
                            readingTime: calculateReadingTime(
                                validatedData.content.map((section): ContentSection => ({
                                     id: section.id || crypto.randomUUID(),
                                    type: section.type,
                                   content: section.content,
                                     metadata: section.metadata
                                }))
                              ),
                          revision: 1,
                          lastEditedBy: validatedData.author.id,
                          customFields: {}
                      },
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                       projectId: validatedData.projectId
                  };

                  set((state) => ({
                      posts: [...state.posts, newPost],
                  }));

                  return newPost;
              } catch (error) {
                  console.error("Add post error:", error);
                  throw error;
              }
            },

            updatePost: async (id, updates) => {
                 try {
                    const post = get().posts.find(p => p.id === id);
                    if (!post) throw new Error('Post not found');
        
                    // Validate updates
                     if (updates.title || updates.content) {
                       await blogPostSchema.partial().parseAsync(updates);
                     }
        
                    // Construct updated post with correct types
                    const updatedPost: BlogPost = {
                        ...post,
                        ...updates,
                        // Fix author structure to match Pick<User> type
                        author: {
                            id: updates.author?.id || post.author.id,
                            username: updates.author?.username || post.author.username,
                            fullName: updates.author?.fullName || post.author.fullName,
                            avatar: updates.author?.avatar || post.author.avatar
                        },
                        // Ensure coAuthors follow the same structure if provided
                        coAuthors: updates.coAuthors?.map((coAuthor) => ({
                            id: coAuthor.id,
                            username: coAuthor.username || 'unknown',
                            fullName: coAuthor.fullName || 'Unknown',
                            avatar: coAuthor.avatar
                        })) || post.coAuthors,
                        // Handle content updates if provided
                        content: updates.content?.map((section): ContentSection => ({
                            id: section.id || crypto.randomUUID(),
                            type: section.type,
                            content: section.content,
                            metadata: section.metadata
                        })) || post.content,
                        // Update metadata
                        metadata: {
                            ...post.metadata,
                            revision: (post.metadata?.revision || 0) + 1,
                            lastEditedBy: updates.author?.id || post.author.id,
                            wordCount: updates.content 
                                ? calculateWordCount( updates.content.map((section): ContentSection => ({
                                     id: section.id || crypto.randomUUID(),
                                    type: section.type,
                                   content: section.content,
                                     metadata: section.metadata
                                })))
                                : post.metadata?.wordCount,
                            readingTime: updates.content 
                                ? calculateReadingTime( updates.content.map((section): ContentSection => ({
                                       id: section.id || crypto.randomUUID(),
                                     type: section.type,
                                    content: section.content,
                                     metadata: section.metadata
                                  })))
                                : post.metadata?.readingTime,
                            customFields: {
                                ...(post.metadata?.customFields || {}),
                                ...(updates.metadata?.customFields || {})
                            }
                         },
                        updatedAt: new Date().toISOString(),
                    };
        
                    set((state) => ({
                        posts: state.posts.map(p => p.id === id ? updatedPost : p),
                    }));
        
                   return updatedPost;
                } catch (error) {
                   console.error("Update post error:", error);
                    throw error;
                }
            },

            deletePost: async (id) => {
                set((state) => ({
                    posts: state.posts.filter(p => p.id !== id),
                    comments: state.comments.filter(c => c.postId !== id),
                }));
            },

            getPost: (id) => get().posts.find(p => p.id === id),

            getPostBySlug: (slug) => get().posts.find(p => p.slug === slug),

             addCategory: (data) => {
                const validated = categorySchema.parse(data);
                const newCategory: Category = {
                   id: crypto.randomUUID(),
                   name: validated.name || '',
                    slug: validated.slug,
                     description: validated.description,
                     parentId: validated.parentId,
                     color: validated.color,
                     coverImage: validated.coverImage,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                 };

                set((state) => ({
                    categories: [...state.categories, newCategory],
                }));

                return newCategory;
            },


            updateCategory: (id, updates) => {
                categorySchema.partial().parse(updates);

                set((state) => ({
                    categories: state.categories.map(c =>
                        c.id === id
                            ? { ...c, ...updates, updatedAt: new Date().toISOString() }
                            : c
                    ),
                }));
            },

            deleteCategory: (id) => {
                set((state) => ({
                    categories: state.categories.filter(c => c.id !== id),
                    // Update posts to remove deleted category
                    posts: state.posts.map(post => ({
                        ...post,
                        categories: post.categories.filter(catId => catId !== id),
                    })),
                }));
            },

            getCategory: (id) => get().categories.find(c => c.id === id),

            addTag: (data) => {
                const newTag: Tag = {
                    id: crypto.randomUUID(),
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                set((state) => ({
                    tags: [...state.tags, newTag],
                }));

                return newTag;
            },

            updateTag: (id, updates) => {
                set((state) => ({
                    tags: state.tags.map(t =>
                        t.id === id
                            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                            : t
                    ),
                }));
            },

            deleteTag: (id) => {
                set((state) => ({
                    tags: state.tags.filter(t => t.id !== id),
                    // Update posts to remove deleted tag
                    posts: state.posts.map(post => ({
                        ...post,
                        tags: post.tags.filter(tagId => tagId !== id),
                    })),
                }));
            },

           addComment: (postId, author, data) => {
                 try {
                    const validated = commentSchema.parse(data);
                     const newComment: Comment = {
                       id: crypto.randomUUID(),
                      postId,
                       ...validated,
                       author,
                       status: 'pending',
                      likes: 0,
                       createdAt: new Date().toISOString(),
                       updatedAt: new Date().toISOString(),
                       content: validated.content || '',
                  };
    
                  set((state) => ({
                      comments: [...state.comments, newComment],
                  }));
    
                     return newComment;
                 }catch(error){
                      console.log("add comment error", error)
                     throw error
                 }
    
            },
    
            updateComment: (id, updates) => {
                set((state) => ({
                    comments: state.comments.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                ...updates,
                                updatedAt: new Date().toISOString(),
                                metadata: {
                                    ...c.metadata,
                                    editHistory: [
                                        ...(c.metadata?.editHistory || []),
                                        {
                                            content: c.content,
                                            editedAt: new Date().toISOString(),
                                        },
                                    ],
                                },
                            }
                            : c
                    ),
                }));
            },

            deleteComment: (id) => {
                set((state) => ({
                    comments: state.comments.map(c =>
                        c.id === id
                            ? { ...c, status: 'deleted' }
                            : c
                    ),
                }));
            },

            getPostComments: (postId) => {
                return get().comments.filter(c =>
                    c.postId === postId &&
                    c.status !== 'deleted' &&
                    c.status !== 'spam'
                );
            },

            getProjectPosts: (projectId, status) => {
                return get().posts.filter(post =>
                    post.projectId === projectId &&
                    (!status || post.status === status)
                );
            },

            getPostsByCategory: (categoryId) => {
                return get().posts.filter(post =>
                    post.categories.includes(categoryId) &&
                    post.status === 'published'
                );
            },

            getPostsByTag: (tagId) => {
                return get().posts.filter(post =>
                    post.tags.includes(tagId) &&
                    post.status === 'published'
                );
            },

            searchPosts: (query) => {
                const searchTerms = query.toLowerCase().split(' ');
                return get().posts.filter(post => {
                    const searchableContent = [
                        post.title,
                        post.excerpt,
                        ...post.content.map(section => section.content)
                    ].join(' ').toLowerCase();

                    return searchTerms.every(term => searchableContent.includes(term));
                });
            },

           incrementPostViews: (postId) => {
                 set((state) => ({
                   posts: state.posts.map(post =>
                     post.id === postId
                       ? {
                           ...post,
                           analytics: {
                               ...post.analytics,
                               views: (post.analytics?.views || 0) + 1,
                            } as PostAnalytics,
                         }
                       : post
                   ),
                 }));
             },

        updatePostAnalytics: async (postId, data) => {
            try {
                const post = get().posts.find(p => p.id === postId);
                if (!post) throw new Error('Post not found');
        
                // Validate and parse the analytics data
                const validatedAnalytics = await postAnalyticsSchema.parseAsync({
                   ...post.analytics,
                    ...data,
                    // Ensure all required fields have default values
                    views: data.views ?? post.analytics?.views ?? 0,
                    uniqueVisitors: data.uniqueVisitors ?? post.analytics?.uniqueVisitors ?? 0,
                    averageTimeOnPage: data.averageTimeOnPage ?? post.analytics?.averageTimeOnPage ?? 0,
                    bounceRate: data.bounceRate ?? post.analytics?.bounceRate ?? 0,
                    // Handle nested objects with defaults
                    shares: {
                        facebook: data.shares?.facebook ?? post.analytics?.shares?.facebook ?? 0,
                        twitter: data.shares?.twitter ?? post.analytics?.shares?.twitter ?? 0,
                        linkedin: data.shares?.linkedin ?? post.analytics?.shares?.linkedin ?? 0,
                     },
                     deviceBreakdown: {
                        desktop: data.deviceBreakdown?.desktop ?? post.analytics?.deviceBreakdown?.desktop ?? 0,
                       mobile: data.deviceBreakdown?.mobile ?? post.analytics?.deviceBreakdown?.mobile ?? 0,
                        tablet: data.deviceBreakdown?.tablet ?? post.analytics?.deviceBreakdown?.tablet ?? 0,
                    },
                    geoData: data.geoData ?? post.analytics?.geoData ?? {},
                });
        
                set((state) => ({
                    posts: state.posts.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                analytics: validatedAnalytics as PostAnalytics,
                                updatedAt: new Date().toISOString(),
                            }
                            : post
                    ),
                }));
        
                // Return the updated post
                return get().posts.find(p => p.id === postId)!;
            } catch (error) {
                console.error("Update Analytics error:", error);
                throw new Error(`Failed to update analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
        }),
        {
            name: 'blog-storage',
        }
    )
);


// Helper functions
function calculateWordCount(content: ContentSection[]): number {
    return content.reduce((count, section) => {
        if (section.type === 'text') {
            return count + section.content.split(/\s+/).length;
        }
        return count;
    }, 0);
}

function calculateReadingTime(content: ContentSection[]): number {
    const wordsPerMinute = 200;
    const wordCount = calculateWordCount(content);
    return Math.ceil(wordCount / wordsPerMinute);
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/--+/g, "-") // Replace multiple - with single -
        .trim(); // Trim any trailing - or spaces
}

// Custom hooks for common operations
export function useProjectBlog(projectId: string) {
    const store = useBlogStore();

    const posts = store.getProjectPosts(projectId);
    const drafts = store.getProjectPosts(projectId, 'draft');
    const published = store.getProjectPosts(projectId, 'published');
    const scheduled = store.getProjectPosts(projectId, 'scheduled');

    return {
        posts,
        drafts,
        published,
        scheduled,
        categories: store.categories,
        tags: store.tags,
        addPost: store.addPost,
        updatePost: store.updatePost,
        deletePost: store.deletePost,
        addCategory: store.addCategory,
        addTag: store.addTag,
    };
}

export function usePost(postId: string) {
    const store = useBlogStore();

    const post = store.getPost(postId);
    const comments = store.getPostComments(postId);

    return {
        post,
        comments,
        updatePost: store.updatePost,
        addComment: (author: Parameters<typeof store.addComment>[1], data: Parameters<typeof store.addComment>[2]) =>
            store.addComment(postId, author, data),
        incrementViews: () => store.incrementPostViews(postId),
         updateAnalytics: (data: Parameters<typeof store.updatePostAnalytics>[1]) =>
            store.updatePostAnalytics(postId, data),
    };
}