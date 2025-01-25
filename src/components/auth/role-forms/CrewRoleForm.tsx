// components/auth/role-forms/CrewRoleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from '@/components/shared/FileUpload';

const crewSchema = z.object({
  department: z.string().min(1, 'Please select a department'),
  role: z.string().min(1, 'Role is required'),
  experience: z.string().min(10, 'Please provide some experience details'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  equipment: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  dayRate: z.string().regex(/^\d+$/, 'Day rate must be a number'),
  availability: z.object({
    immediate: z.boolean(),
    notice: z.string().optional(),
  }),
  portfolioLinks: z.array(z.string().url()).optional(),
  resume: z.string().optional(),
});

const departments = [
  'Camera',
  'Lighting',
  'Sound',
  'Art',
  'Wardrobe',
  'Hair/Makeup',
  'Grip/Electric',
  'Post-Production',
] as const;

const skillsByDepartment: Record<string, string[]> = {
  'Camera': ['Camera Operation', '1st AC', '2nd AC', 'DIT', 'Steadicam'],
  'Lighting': ['Gaffer', 'Best Boy', 'Lighting Tech', 'Board Operator'],
  'Sound': ['Production Sound Mixer', 'Boom Operator', 'Sound Design', 'ADR'],
  // Add more department skills
};

export function CrewRoleForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(crewSchema),
    defaultValues: defaultValues || {
      department: '',
      role: '',
      experience: '',
      skills: [],
      equipment: [],
      certifications: [],
      dayRate: '',
      availability: {
        immediate: true,
        notice: ''
      },
      portfolioLinks: [],
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!form.watch('department')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.watch('department') &&
                      skillsByDepartment[form.watch('department')].map((role) => (
                        <SelectItem key={role} value={role.toLowerCase()}>
                          {role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your experience in this role..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dayRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Rate (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter day rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="portfolioLinks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio/Reel Links</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Add portfolio links (comma separated)"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(link => link.trim()))}
                  value={field.value?.join(', ')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save and Continue</Button>
      </form>
    </Form>
  );
}