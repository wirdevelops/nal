import { useState } from 'react';
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
import { Card } from "@/components/ui/card";
import { FileUpload } from '@/components/shared/FileUpload';
import { Loader2, CheckCircle2, Upload } from 'lucide-react';
import { UserRole } from '@/types/user';

const verificationSchema = z.object({
  documents: z.array(z.string()).min(1, 'At least one document is required'),
  idNumber: z.string().optional(),
  professionalMemberships: z.array(z.string()).optional(),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface VerificationRequirement {
  title: string;
  description: string;
  required: boolean;
  accept: string;
  maxSize: number;
}

const ROLE_REQUIREMENTS: Record<UserRole, VerificationRequirement[]> = {
  'project-owner': [
    {
      title: 'Business Registration',
      description: 'Company registration or business license',
      required: true,
      accept: 'application/pdf,image/*',
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  ],
  'crew': [
    {
      title: 'Professional Certification',
      description: 'Industry certifications or qualifications',
      required: false,
      accept: 'application/pdf,image/*',
      maxSize: 5 * 1024 * 1024
    }
  ],
  'actor': [
    {
      title: 'Headshots',
      description: 'Professional headshots and portfolio',
      required: true,
      accept: 'image/*',
      maxSize: 10 * 1024 * 1024
    }
  ],
  'producer': [
    {
      title: 'Production Company Details',
      description: 'Company registration and credentials',
      required: true,
      accept: 'application/pdf',
      maxSize: 5 * 1024 * 1024
    }
  ],
  'vendor': [
    {
      title: 'Business License',
      description: 'Valid business license and tax documents',
      required: true,
      accept: 'application/pdf',
      maxSize: 5 * 1024 * 1024
    }
  ],
  'ngo': [
    {
      title: 'Organization Documents',
      description: 'NGO registration and proof of status',
      required: true,
      accept: 'application/pdf',
      maxSize: 5 * 1024 * 1024
    }
  ],
  'admin': []
};

interface VerificationFormProps {
  roles: UserRole[];
  onSubmit: (data: VerificationFormValues) => Promise<void>;
  defaultValues?: Partial<VerificationFormValues>;
}

export function VerificationForm({ roles, onSubmit, defaultValues }: VerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      documents: [],
      idNumber: '',
      professionalMemberships: [],
      ...defaultValues
    },
  });

  const requirements = roles.flatMap(role => ROLE_REQUIREMENTS[role]);

  const handleSubmit = async (values: VerificationFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Verification Requirements</h2>
        <p className="text-sm text-muted-foreground">
          Please provide the following documents to verify your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {requirements.map((requirement, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{requirement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {requirement.description}
                  </p>
                </div>

                <FileUpload
                  accept={requirement.accept}
                  maxSize={requirement.maxSize}
                  onUpload={async (files) => {
                    const fileUrls = files.map(file => URL.createObjectURL(file));
                    form.setValue('documents', [
                      ...form.getValues('documents'),
                      ...fileUrls
                    ]);
                    setUploadedFiles({
                      ...uploadedFiles,
                      [requirement.title]: files
                    });
                  }}
                  value={uploadedFiles[requirement.title]?.map(f => URL.createObjectURL(f)) || []}
                />

                {requirement.required && !uploadedFiles[requirement.title]?.length && (
                  <p className="text-sm text-destructive">This document is required</p>
                )}
              </div>
            </Card>
          ))}

          {roles.some(role => ['actor', 'crew'].includes(role)) && (
            <FormField
              control={form.control}
              name="professionalMemberships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Memberships (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter membership IDs or organizations"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                      value={field.value?.join(', ')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting verification
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Verification
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}