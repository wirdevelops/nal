    // src/app/ngo/projects/new/page.tsx
    'use client'

    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { useForm } from 'react-hook-form';
    import { toast } from '@/hooks/use-toast';
    import { Button } from '@/components/ui/button';
    import {
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from '@/components/ui/form';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import {
        RadioGroup,
        RadioGroupItem,
    } from "@/components/ui/radio-group"
    import { Label } from "@/components/ui/label"
    import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
    import { Budget, CreateProjectSchema, NGOProject, type CreateProjectSchemaType } from '@/types/ngo/project';
    import { PROJECT_CATEGORIES, Location } from '@/types/ngo/project'; // This is the fix


    export default function NewProjectPage() {
      const [loading, setLoading] = useState(false)
      const router = useRouter()
      const store = useNGOProjectStore();
  
      const form = useForm<CreateProjectSchemaType>({
        resolver: zodResolver(CreateProjectSchema),
        defaultValues: {
          name: "",
          category: 'education',
          description: '',
        },
      });
  
      async function onSubmit(values: CreateProjectSchemaType) {
          setLoading(true)
          try {
            const defaultLocation: Location = {
              address: '',
              city: '',
              state: '',
              country: '',
            };
        
            const defaultBudget: Budget = {
              allocated: 0,
              total: 0,
              amount: 0,
              currency: 'USD',
            };
        
            const defaultTimeline = {
              startDate: new Date().toISOString(),
              milestones: [],
              media: []
            };
        
            const projectData: Omit<NGOProject, "id" | "createdAt" | "updatedAt" | "metrics"> = {
              ...values,
              // Required primitive fields
              status: 'planned',
              startDate: new Date().toISOString(),
              duration: 0,
              url: '',
              
              // Complex type defaults
              location: defaultLocation,
              budget: defaultBudget,
              timeline: defaultTimeline,
              
              // Empty arrays for collection properties
              media: [],
              impact: [],
              donations: [],
              impactStories: [],
              team: [],
              beneficiaries: [],
              milestones: [],
              gallery: [],
              updates: [],
              reports: [],
              donors: [],
              
              // Ensure all required fields are present
              description: values.description || '', // Handle optional description
              endDate: undefined, // Explicitly set optional fields
            };
        
            store.createProject(projectData);

              toast({
                  title: "Success!",
                  description: "Project created successfully!",
              });
              router.push('/ngo')
          } catch(e) {
          console.log(e)
          toast({
              title: "Error!",
              description: "Something went wrong, please try again!",
              variant: 'destructive'
          });
          } finally {
          setLoading(false);
          }
      }
    
      return (
        <div className="container py-10">
          <h2 className="text-3xl font-bold tracking-tight pb-10">Create a New Project</h2>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                          <Input placeholder="Project Name" {...field} />
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
                          placeholder="Detailed description of the project..."
                          className="resize-none"
                          {...field}
                          />
                      </FormControl>
                      <FormDescription>
                          Provide a detailed description of your project.
                      </FormDescription>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                          <FormItem>
                              <Label>Category</Label>
                              <RadioGroup name="category" className="grid grid-cols-2 gap-4"  onValueChange={field.onChange} defaultValue={field.value}>
                                  {PROJECT_CATEGORIES.map((category) => (
                                      <div key={category} className="flex items-center space-x-2">
                                          <RadioGroupItem value={category} id={category} />
                                          <Label htmlFor={category}>
                                              {category}
                                          </Label>
                                      </div>
                                  ))}
                              </RadioGroup>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />
                  <Button type="submit" disabled={loading} >
                      Create Project
                  </Button>
              </form>
          </Form>
        </div>
      )
  }