// components/auth/role-forms/NGORoleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ngoSchema = z.object({
  organizationName: z.string().min(2),
  registrationNumber: z.string().min(2),
  focusAreas: z.array(z.string()).min(1),
  impactMetrics: z.array(z.string()),
  projectBudget: z.object({
    min: z.number(),
    max: z.number(),
  }),
  teamSize: z.number().min(1),
  previousCollaborations: z.array(z.object({
    project: z.string(),
    year: z.number(),
    outcome: z.string()
  })).optional(),
  fundingSources: z.array(z.string()),
  locationServed: z.array(z.string()).min(1),
  acceptsVolunteers: z.boolean()
});

export function NGORoleForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(ngoSchema),
    defaultValues: defaultValues || {
      organizationName: '',
      registrationNumber: '',
      focusAreas: [],
      impactMetrics: [],
      projectBudget: { min: 0, max: 0 },
      teamSize: 1,
      previousCollaborations: [],
      fundingSources: [],
      locationServed: [],
      acceptsVolunteers: false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="focusAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus Areas</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter focus areas (comma separated)"
                  onChange={(e) => field.onChange(e.target.value.split(',').map(area => area.trim()))}
                  value={field.value?.join(', ')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectBudget.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Project Budget</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectBudget.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Project Budget</FormLabel>
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
          name="locationServed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locations Served</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter locations (comma separated)"
                  onChange={(e) => field.onChange(e.target.value.split(',').map(loc => loc.trim()))}
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

// components/auth/role-forms/VendorRoleForm.tsx
const vendorSchema = z.object({
  businessName: z.string().min(2),
  businessType: z.enum(['Equipment Rental', 'Services', 'Venue', 'Props/Costumes', 'Other']),
  taxId: z.string().min(2),
  services: z.array(z.string()).min(1),
  equipmentCategories: z.array(z.string()),
  locationsCovered: z.array(z.string()),
  insuranceCoverage: z.boolean(),
  paymentMethods: z.array(z.string()),
  minimumBooking: z.string(),
  availability: z.object({
    weekends: z.boolean(),
    afterHours: z.boolean(),
    onsite: z.boolean()
  })
});

export function VendorRoleForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: defaultValues || {
      businessName: '',
      businessType: 'Equipment Rental',
      services: [],
      equipmentCategories: [],
      locationsCovered: [],
      insuranceCoverage: false,
      paymentMethods: [],
      minimumBooking: '1 day',
      availability: {
        weekends: false,
        afterHours: false,
        onsite: true
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment Rental">Equipment Rental</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                    <SelectItem value="Props/Costumes">Props/Costumes</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services Offered</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter services (comma separated)"
                  onChange={(e) => field.onChange(e.target.value.split(',').map(service => service.trim()))}
                  value={field.value?.join(', ')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="availability.weekends"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Available on Weekends</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability.afterHours"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Available After Hours</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save and Continue</Button>
      </form>
    </Form>
  );
}