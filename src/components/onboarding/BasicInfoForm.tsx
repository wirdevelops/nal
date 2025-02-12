// src/components/onboarding/BasicInfoForm.tsx
import { useForm } from 'react-hook-form';
import { basicInfoSchema } from '@/lib/validations/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-menubar';
import { Input } from '../ui/input';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';

export const BasicInfoForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(basicInfoSchema)
  });

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};