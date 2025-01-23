// components/project/ProjectDetailsForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { FileUpload } from '@/components/shared/FileUpload';
import type { ProjectType, QuickOption } from '@/types/project-types/projectTypes';
import type { ProjectCreationData } from '@/types/validation';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  thumbnail: z.any().optional(), // File upload
  startDate: z.date().optional(),
  targetDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectDetailsFormProps {
  type: ProjectType;
  quickStartOption: QuickOption | null;
  initialData: Partial<ProjectCreationData>;
  onSubmit: (data: ProjectCreationData) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ProjectDetailsForm({
  type,
  quickStartOption,
  initialData,
  onSubmit,
  onBack,
  isSubmitting
}: ProjectDetailsFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      startDate: initialData.startDate,
      targetDate: initialData.targetDate,
    }
  });

  const handleFormSubmit = async (values: FormValues) => {
    // Create complete ProjectCreationData object
    const submitData: ProjectCreationData = {
      title: values.title,
      description: values.description,
      type: type.id,
      thumbnailFile: thumbnailFile || undefined,
      typeData: initialData.typeData,
      startDate: values.startDate,
      targetDate: values.targetDate,
      primaryTool: quickStartOption?.primaryTool || 'overview',
    };

    await onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter project title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your project"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Thumbnail</FormLabel>
              <FormControl>
                <FileUpload
                  onFileSelect={async (file) => {
                    setThumbnailFile(file);
                    field.onChange(file);
                  }}
                  onRemove={() => {
                    setThumbnailFile(null);
                    field.onChange(null);
                  }}
                  accept="image/*"
                  maxSize={2 * 1024 * 1024}
                  showPreview
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < form.getValues('startDate')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}