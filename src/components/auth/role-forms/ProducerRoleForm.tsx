// components/auth/role-forms/ProducerRoleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const producerSchema = z.object({
  producerType: z.array(z.enum(['Executive', 'Line', 'Associate', 'Co-Producer'])),
  companyName: z.string().min(2, 'Company name is required'),
  projectTypes: z.array(z.string()).min(1, 'Select at least one project type'),
  budgetRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string()
  }),
  completedProjects: z.number(),
  currentProjects: z.number(),
  expertise: z.array(z.string()).min(1, 'Select areas of expertise'),
  distributionConnections: z.boolean(),
  fundingNetwork: z.boolean(),
  affiliations: z.array(z.string()),
  preferredGenres: z.array(z.string())
});

export function ProducerRoleForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(producerSchema),
    defaultValues: defaultValues || {
      producerType: [],
      companyName: '',
      projectTypes: [],
      budgetRange: { min: 0, max: 0, currency: 'USD' },
      completedProjects: 0,
      currentProjects: 0,
      expertise: [],
      distributionConnections: false,
      fundingNetwork: false,
      affiliations: [],
      preferredGenres: []
    }
  });

  // const projectTypes = [
  //   'Feature Films', 'Short Films', 'Documentaries', 
  //   'TV Series', 'Web Series', 'Commercials', 'Music Videos'
  // ];

  const expertiseAreas = [
    'Development', 'Financing', 'Pre-production',
    'Production', 'Post-production', 'Distribution',
    'Marketing', 'International Co-productions'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Production Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budgetRange.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Budget (USD)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetRange.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Budget (USD)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas of Expertise</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange([...field.value, value])}
                value={field.value[field.value.length - 1]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expertise" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseAreas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="completedProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Projects</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentProjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Projects</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save and Continue</Button>
      </form>
    </Form>
  );
}