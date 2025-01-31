// components/auth/role-forms/ActorRoleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from '@/components/shared/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const actorSchema = z.object({
  actingStyles: z.array(z.string()).min(1, 'Select at least one style'),
  headshots: z.array(z.string()).min(1, 'At least one headshot is required'),
  reels: z.array(z.string()),
  height: z.string().min(1, 'Height is required'),
  age: z.string().min(1, 'Age range is required'),
  unionStatus: z.enum(['SAG-AFTRA', 'Equity', 'Non-Union']),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  specialSkills: z.array(z.string()),
  imdbLink: z.string().url().optional(),
  availability: z.object({
    immediate: z.boolean(),
    restrictions: z.string().optional()
  })
});

export function ActorRoleForm({ onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(actorSchema),
    defaultValues: defaultValues || {
      actingStyles: [],
      headshots: [],
      reels: [],
      height: '',
      age: '',
      unionStatus: 'Non-Union',
      languages: ['English'],
      specialSkills: [],
      availability: { immediate: true }
    }
  });

  // const actingStyles = [
  //   'Theater', 'Film', 'Television', 'Commercial', 
  //   'Voice-over', 'Musical Theater', 'Improv', 'Classical'
  // ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="headshots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headshots</FormLabel>
                <FileUpload
                  onUpload={async (files) => field.onChange(files.map(f => URL.createObjectURL(f)))}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  value={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo Reels (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Add video links (comma separated)"
                    onChange={(e) => field.onChange(e.target.value.split(',').map(link => link.trim()))}
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
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input placeholder="5'10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Range</FormLabel>
                  <FormControl>
                    <Input placeholder="25-35" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="unionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Union Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select union status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAG-AFTRA">SAG-AFTRA</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Non-Union">Non-Union</SelectItem>
                  </SelectContent>
                </Select>
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