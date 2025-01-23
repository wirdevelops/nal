// app/projects/[projectId]/casting/components/AddApplicantDialog.tsx
'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogProps } from '../types';
import { useCastingStore } from '@/stores/useCastingStore';
import {useForm } from 'react-hook-form';
import {  useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

const FormSchema = z.object({
    memberId: z.string().min(1, {message: 'Member is required'}),
    resume: z.string().optional(),
    demoReel: z.string().optional(),
    video: z.string().optional(),
    audio: z.string().optional(),
    notes: z.string().optional()
});

interface AddApplicantFormState {
  errors?: {
    memberId?: string[],
    resume?: string[],
    demoReel?: string[],
    video?: string[],
    audio?: string[],
    notes?: string[],
    _form?: string[]
  };
}

async function addApplicantAction(prevState: AddApplicantFormState, formData: FormData): Promise<AddApplicantFormState> {
    const validatedFields = FormSchema.safeParse({
        memberId: formData.get('memberId'),
        resume: formData.get('resume'),
        demoReel: formData.get('demoReel'),
        video: formData.get('video'),
        audio: formData.get('audio'),
        notes: formData.get('notes')
    });

    if (!validatedFields.success) {
      return {
          errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const { memberId, resume, demoReel, video, audio, notes } = validatedFields.data;
    addApplicant({memberId, auditionId, resume, demoReel, video, audio, notes});
    return {errors: undefined};
}

let addApplicant: (applicant: {
    memberId: string,
    auditionId: string,
    resume?: string,
    demoReel?: string,
    video?: string,
    audio?: string,
    notes?: string
}) => void;

let auditionId: string;

export function AddApplicantDialog({ open, onOpenChange, auditionId: id }: DialogProps & { auditionId: string}) {
    const router = useRouter();
    addApplicant = useCastingStore(state => state.addApplicant);
    auditionId = id;
    const { members } = useCastingStore();
    const [fileInputs, setFileInputs] = useState<{resume?: File | null, demoReel?: File | null, video?: File | null, audio?: File | null}>({})

    const [state, formAction] = useFormState(addApplicantAction, {});
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = () => {
      reset();
      setFileInputs({});
      onOpenChange(false);
      router.refresh();
  }

  React.useEffect(() => {
      if(state.errors === undefined) {
          onSubmit();
      }
  }, [state.errors, onSubmit])
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        const fieldName = event.target.name;
        if(file) {
          setFileInputs({...fileInputs, [fieldName]: file})
        } else {
          setFileInputs({...fileInputs, [fieldName]: null})
        }
    };

    React.useEffect(() => {
        register('resume');
        register('demoReel');
        register('video');
        register('audio');
    }, [register])


    React.useEffect(() => {
      const convertFileToBase64 = async (file: File | null): Promise<string | null> => {
          if (!file) return null;
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
          });
      };
      const processFiles = async () => {
          const resume = fileInputs.resume ? await convertFileToBase64(fileInputs.resume) : null;
          const demoReel = fileInputs.demoReel ? await convertFileToBase64(fileInputs.demoReel) : null;
          const video = fileInputs.video ? await convertFileToBase64(fileInputs.video) : null;
          const audio = fileInputs.audio ? await convertFileToBase64(fileInputs.audio) : null;
            register('resume', {value: resume});
            register('demoReel', {value: demoReel});
            register('video', {value: video});
            register('audio', {value: audio});
      }
      processFiles();
  }, [fileInputs, register])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Applicant to Audition</DialogTitle>
            </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memberId" className="text-right">
                Member
              </Label>
                <Select {...register('memberId')}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent>
                            {members.map(member => (
                                <SelectItem key={member.id} value={member.id}>{member.name} - {member.role}</SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                {state.errors?.memberId &&
                    state.errors.memberId.map((error, i) => (
                        <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resume" className="text-right">
                Resume
              </Label>
            <Input
              type="file"
              id="resume"
              className="col-span-3"
              name="resume"
              onChange={handleFileChange}
            />
              {state.errors?.resume &&
                    state.errors.resume.map((error, i) => (
                        <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="demoReel" className="text-right">
                    Demo Reel
                </Label>
                <Input
                  type="file"
                  id="demoReel"
                  className="col-span-3"
                  name="demoReel"
                  onChange={handleFileChange}
                />
               {state.errors?.demoReel &&
                    state.errors.demoReel.map((error, i) => (
                        <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
        </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video" className="text-right">
                Video
              </Label>
                <Input
                  type="file"
                  id="video"
                  className="col-span-3"
                  name="video"
                  onChange={handleFileChange}
                  />
               {state.errors?.video &&
                    state.errors.video.map((error, i) => (
                        <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audio" className="text-right">
                    Audio
                </Label>
                <Input
                    type="file"
                    id="audio"
                    className="col-span-3"
                    name="audio"
                    onChange={handleFileChange}
                    />
                {state.errors?.audio &&
                    state.errors.audio.map((error, i) => (
                        <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                    ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                    Notes
                </Label>
                <Textarea
                  id="notes"
                  className="col-span-3"
                  placeholder="Add any additional notes"
                  {...register('notes')}
                  />
                    {state.errors?.notes &&
                        state.errors.notes.map((error, i) => (
                            <p key={i} className="col-span-4 text-sm text-destructive">{error}</p>
                        ))}
              </div>
            <DialogFooter>
            <Button type="button" variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Applicant</Button>
          </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
  );
}