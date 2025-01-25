// components/auth/role-forms/ProjectOwnerForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  companyName: z.string().min(2),
  projectTypes: z.array(z.enum(['Feature', 'Short', 'Documentary', 'Series', 'Commercial'])),
  typicalBudget: z.enum(['Under 10k', '10k-50k', '50k-200k', '200k+']),
  teamSize: z.number().min(1),
  experience: z.string().optional(),
});

export function ProjectOwnerForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      companyName: '',
      projectTypes: [],
      typicalBudget: 'Under 10k',
      teamSize: 1,
      experience: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company/Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Types</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange([...field.value, value])}
                value={field.value[field.value.length - 1]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feature">Feature Films</SelectItem>
                  <SelectItem value="Short">Short Films</SelectItem>
                  <SelectItem value="Documentary">Documentaries</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                  <SelectItem value="Commercial">Commercials</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typicalBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typical Budget Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under 10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                  <SelectItem value="50k-200k">$50,000 - $200,000</SelectItem>
                  <SelectItem value="200k+">$200,000+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
}

// Additional role-specific forms can be added (ActorForm, ProducerForm, etc.)