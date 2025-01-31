'use client';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skill, BackgroundCheck, Volunteer } from '@/types/ngo/volunteer';
import { useVolunteer } from '@/hooks/useVolunteer';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { useToast } from '@/components/ui/use-toast';
import { parsePhoneNumber } from 'libphonenumber-js';

const formSteps = [
  { title: 'Personal Information', fields: ['firstName', 'lastName', 'email', 'phone'] },
  { title: 'Skills & Availability', fields: ['skills', 'availability'] },
  { title: 'Additional Information', fields: ['experience', 'references'] },
];

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
  .min(6, 'Phone number must be at least 6 digits')
  .max(20, 'Phone number too long')
  .refine((val) => {
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    return phoneRegex.test(val);
  }, 'Invalid phone number format'),
  skills: z.array(z.nativeEnum(Skill)).min(1, 'Select at least one skill'),
  availability: z.object({
    days: z.array(z.string()).min(1, 'Select at least one day'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  }),
  experience: z.string().optional(),
  references: z.array(z.object({
    name: z.string(),
    contact: z.string(),
    relationship: z.string(),
  })).optional(),
});

export function VolunteerSignupForm({ onSuccess, onCancel }: { 
  onSuccess: () => void; 
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const { registerVolunteer, isLoading } = useVolunteer();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      skills: [],
      availability: {
        days: [],
        startTime: '09:00',
        endTime: '17:00',
      },
      experience: '',
      references: [],
    },
  });

  const handleSkillToggle = (skill: Skill) => {
    const currentSkills = form.getValues('skills');
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    form.setValue('skills', newSkills);
  };

  const handleDayToggle = (day: string) => {
    const currentDays = form.getValues('availability.days');
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    form.setValue('availability.days', newDays);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const parsedPhone = parsePhoneNumber(values.phone, 'US')?.formatInternational() || values.phone;
    try {
      const volunteerData: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'> = {
        // Personal Info
        userId: uuidv4(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: parsedPhone,

        // Skills & Availability
        skills: values.skills,
        availability: {
          days: values.availability.days,
          startTime: values.availability.startTime,
          endTime: values.availability.endTime
        },

        // References (add required fields)
        references: (values.references || []).map(ref => ({
          id: uuidv4(), // Generate unique ID
          name: ref.name,
          relationship: ref.relationship,
          contact: ref.contact,
          status: 'pending' as const
        })),

        // Required fields with defaults
        projects: [],
        hours: [],
        background: BackgroundCheck.PENDING,
        trainings: [],

        // Optional fields
        location: undefined,
        notes: values.experience ? values.experience : undefined,
        role: '',
        joinDate: '',
        trainingCompleted: false,
        hoursContributed: 0
      };
  
      await registerVolunteer(volunteerData);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
      console.error('Submission error:', error);
    }
  };

  const nextStep = async () => {
    const fields = formSteps[currentStep].fields;
    const output = await form.trigger(fields as any);
    
    if (!output) return;
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8">
          <Progress value={(currentStep + 1) * (100 / formSteps.length)} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep].title}
          </p>
        </div>

        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                  <PhoneInput
            placeholder="Enter phone number"
            {...field}
          />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="font-medium mb-4">Select Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(Skill).map(skill => (
                  <Badge
                    key={skill}
                    variant={form.watch('skills').includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill.toLowerCase().replace('_', ' ')}
                  </Badge>
                ))}
              </div>
              {form.formState.errors.skills && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.skills.message}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-4">Availability</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    type="button"
                    variant={form.watch('availability.days').includes(day) ? 'default' : 'outline'}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              {form.formState.errors.availability?.days && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.availability.days.message}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <FormField
                  control={form.control}
                  name="availability.startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availability.endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe any relevant volunteer experience..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="font-medium mb-4">References (Optional)</h3>
              {[...Array(2)].map((_, index) => (
                <div key={index} className="space-y-4 mb-6">
                  <FormField
                    control={form.control}
                    name={`references.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference {index + 1} Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`references.${index}.contact`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`references.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4">
          {currentStep === 0 ? (
            <Button variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" type="button" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          {currentStep < formSteps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}


