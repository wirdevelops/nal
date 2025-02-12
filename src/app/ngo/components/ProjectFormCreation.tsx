import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNGOProject } from 'others/useNGOProject';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectCategory, ProjectStatus } from '@/types/ngo/project';
import { Loader2 } from 'lucide-react';

export default function ProjectCreationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { createProject, isLoading } = useNGOProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ProjectCategory,
    status: 'planned' as ProjectStatus,
    location: {
      city: '',
      country: '',
      address: '',
      state: ''
    },
    budget: {
      total: 0,
      allocated: 0,
      amount: 0,
      currency: 'USD'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const project = await createProject(formData);
      toast({ title: 'Project created successfully' });
      router.push(`/ngo/projects/${project.id}`);
    } catch (error) {
      toast({
        title: 'Failed to create project',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProjectCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => handleChange('location', { 
                  ...formData.location, 
                  city: e.target.value 
                })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.location.country}
                onChange={(e) => handleChange('location', {
                  ...formData.location,
                  country: e.target.value
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget.total || ''}
                onChange={(e) => handleChange('budget', {
                  ...formData.budget,
                  total: parseFloat(e.target.value)
                })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.budget.currency}
                onValueChange={(value) => handleChange('budget', {
                  ...formData.budget,
                  currency: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}