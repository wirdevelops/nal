import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNGOProject } from '@/hooks/useNGOProject';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProjectCategory, ProjectStatus } from '@/types/ngo/project';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useNGOProject();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as ProjectCategory,
      status: 'planned' as ProjectStatus,
      location: {
        city: formData.get('city') as string,
        country: formData.get('country') as string
      },
      budget: {
        total: Number(formData.get('budget')),
        allocated: 0,
        currency: 'USD'
      }
    };

    try {
      await createProject(projectData);
      toast({
        title: 'Success',
        description: 'Project created successfully'
      });
      router.push('/ngo/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/ngo/projects')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Describe your project"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup name="category" className="grid grid-cols-2 gap-4">
              {Object.values(ProjectCategory).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={category} />
                  <Label htmlFor={category}>
                    {category.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                required
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                required
                placeholder="Country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              required
              placeholder="Enter project budget"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/ngo/projects')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}