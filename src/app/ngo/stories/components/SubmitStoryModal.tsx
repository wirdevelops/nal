'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StoryCategory } from '@/types/ngo/story';
import { StoryCreateDTO } from '@/types/ngo/story';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload'; // Import your existing ImageUpload component
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.nativeEnum(StoryCategory),
  excerpt: z.string().min(50, 'Excerpt must be at least 50 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  authorName: z.string().min(2, 'Name required'),
  authorRole: z.string().min(2, 'Role required'),
  authorOrganization: z.string().min(2, 'Organization required'),
  beneficiaryName: z.string().optional(),
  beneficiaryQuote: z.string().optional(),
});

interface SubmitStoryModalProps {
  onStorySubmit: (story: StoryCreateDTO) => void;
}

export const SubmitStoryModal = ({ onStorySubmit }: SubmitStoryModalProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: StoryCategory.COMMUNITY,
      excerpt: '',
      content: '',
      images: [],
      authorName: '',
      authorRole: '',
      authorOrganization: '',
    }
  });

  const handleImageUpload = (images: string[]) => {
    form.setValue('images', images, { shouldValidate: true });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const storyData: StoryCreateDTO = {
        title: values.title,
      category: values.category,
      excerpt: values.excerpt,
      content: values.content,
        imageUrl: values.images[0], // Take the first uploaded image
        author: {
          id: '',
          name: values.authorName,
          role: values.authorRole,
          organization: values.authorOrganization
        },
        beneficiary: values.beneficiaryName && values.beneficiaryQuote ? {
          name: values.beneficiaryName,
          quote: values.beneficiaryQuote,
          location: ''
        } : undefined,
        date: new Date().toISOString(),
        readTimeMinutes: Math.ceil(values.content.split(' ').length / 200),
        isFeatured: false
      };

      onStorySubmit(storyData);
      form.reset();
      toast({
        title: 'Story Submitted!',
        description: 'Thank you for sharing your impact story.'
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Could not submit story. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto">
          Share Your Story
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
            <h2 className="text-2xl font-bold">Share Your Impact Story</h2>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      onUpload={handleImageUpload}
                      initialImages={field.value}
                      maxFiles={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Story Details */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter story title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(StoryCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add other fields similarly */}

            <Button type="submit" className="w-full">
              Submit Story
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};