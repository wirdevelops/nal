// app/tools/casting/components/CreateAuditionDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogProps } from '../types';
import { useCastingStore } from '@/stores/useCastingStore';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
    role: z.string().min(1, {message: 'Role is required'}),
    date: z.date({ required_error: 'Date is required'}),
    startTime: z.string().min(1, { message: 'Start time is required'}),
    endTime: z.string().min(1, { message: 'End time is required'}),
    location: z.string().min(1, {message: 'Location is required'}),
    slotDuration: z.number({required_error: 'Slot duration is required'}),
    requirements: z.string().optional()
});

interface CreateAuditionFormState {
  errors?: {
    role?: string[],
    date?: string[],
    startTime?: string[],
    endTime?: string[],
    location?: string[],
    slotDuration?: string[],
    requirements?: string[],
    _form?: string[]
  };
}

async function addAuditionAction(prevState: CreateAuditionFormState, formData: FormData): Promise<CreateAuditionFormState> {
    const validatedFields = FormSchema.safeParse({
      role: formData.get('role'),
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      location: formData.get('location'),
      slotDuration: Number(formData.get('slotDuration')),
      requirements: formData.get('requirements')
    });

    if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const { role, date, startTime, endTime, location, slotDuration, requirements } = validatedFields.data;
    addAudition({role, date, startTime, endTime, location, slotDuration, requirements});
    return {errors: undefined};
}

let addAudition: (audition: {
    role: string,
    date: Date | null,
    startTime: string,
    endTime: string,
    location: string,
    slotDuration: number,
    requirements?: string,
}) => void;

export function CreateAuditionDialog({ open, onOpenChange, projectId }: DialogProps) {
  const [date, setDate] = React.useState<Date | null>(null);
    const router = useRouter();
    addAudition = useCastingStore(state => state.addAudition);

    const [state, formAction] = useFormState(addAuditionAction, {});
     const { register, handleSubmit, reset, watch } = useForm();

    const onSubmit = () => {
        reset();
        setDate(null);
        onOpenChange(false);
        router.refresh();
    }

    React.useEffect(() => {
        if(state.errors === undefined) {
            onSubmit();
        }
    }, [state.errors, onSubmit])

    React.useEffect(() => {
        register('date')
    }, [register])

    const watchDate = watch('date')

    React.useEffect(() => {
        if(watchDate) {
            setDate(watchDate)
        }
    }, [watchDate, setDate])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule Audition</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              className="col-span-3"
              placeholder="Enter role title"
              {...register('role')}
            />
            {state.errors?.role &&
                state.errors.role.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    register('date', {value: newDate})
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {state.errors?.date &&
                state.errors.date.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Time Slots
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select {...register('startTime')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    {/* Add more time slots */}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select {...register('endTime')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    {/* Add more time slots */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {state.errors?.startTime &&
                state.errors.startTime.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
            ))}
            {state.errors?.endTime &&
                state.errors.endTime.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
            ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              className="col-span-3"
              placeholder="Enter audition location"
              {...register('location')}
            />
            {state.errors?.location &&
                state.errors.location.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
            ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slots" className="text-right">
              Slot Duration
            </Label>
            <Select {...register('slotDuration', { valueAsNumber: true})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select time per audition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"15"}>15 minutes</SelectItem>
                <SelectItem value={"30"}>30 minutes</SelectItem>
                <SelectItem value={"45"}>45 minutes</SelectItem>
                <SelectItem value={"60"}>1 hour</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.slotDuration &&
                state.errors.slotDuration.map((error, i) => (
                    <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="requirements" className="text-right">
              Requirements
            </Label>
            <Textarea
              id="requirements"
              className="col-span-3"
              placeholder="Enter audition requirements and notes"
              {...register('requirements')}
            />
          </div>
        <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
            </Button>
            <Button type="submit">Schedule Audition</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}