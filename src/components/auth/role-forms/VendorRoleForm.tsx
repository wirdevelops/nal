// components/auth/role-forms/VendorRoleForm.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['Equipment Rental', 'Services', 'Venue', 'Props/Costumes', 'Other']),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  paymentMethods: z.array(z.string()).min(1, 'At least one payment method is required'),
  locationsCovered: z.array(z.string()).min(1, 'At least one location is required'),
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
      paymentMethods: [],
      locationsCovered: [],
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

        <FormField
          control={form.control}
          name="paymentMethods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Methods</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter payment methods (comma separated)"
                  onChange={(e) => field.onChange(e.target.value.split(',').map(method => method.trim()))}
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

          <FormField
            control={form.control}
            name="availability.onsite"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Available for Onsite Service</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save and Continue</Button>
      </form>
    </Form>
  );
}