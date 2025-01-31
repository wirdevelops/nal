'use client';

import { BasicInfoForm } from "@/components/auth/BasicInfoForm";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { UserRole, ActorProfile, CrewProfile, VendorProfile, ProducerProfile, BaseProfile } from '@/types/user';
import * as z from 'zod';

// Define the schema used by the form to infer types
const BasicInfoSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  socialMedia: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional()
  }).optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number').optional()
});


// Create a type for the possible profiles that our profile can be
type ProfileFromRole<R extends UserRole> =
  R extends 'actor' ? ActorProfile :
  R extends 'crew' ? CrewProfile :
  R extends 'vendor' ? VendorProfile :
  R extends 'producer' ? ProducerProfile :
    BaseProfile;


export default function BasicInfoPage() {
  const router = useRouter();
  const { user, updateProfile } = useUserStore();

  const handleSubmit = async (data: z.infer<typeof BasicInfoSchema>) => {
      const role = user.roles[0];

      if (role === 'actor' || role === 'crew' || role === 'vendor' || role === 'producer') {
          await updateProfile(role, data);
      }
    router.push('/auth/onboarding/verification');
  };

  const getDefaultValues = () => {
    const role = user?.roles?.[0] as UserRole; // Type assertion as UserRole for safety
    const profile = user?.profiles?.[role] as ProfileFromRole<typeof role>; // Type assertion for the profile
      
      return {
          location: profile?.location || '',
          bio: profile?.bio || '',
          website: profile?.website || '',
          socialMedia: profile?.socialMedia
              ? {
                linkedin: profile.socialMedia.linkedin || '',
                twitter: profile.socialMedia.twitter || '',
                instagram: profile.socialMedia.instagram || '',
              }
              : undefined,
          phone: profile?.phone || ''
      };
    };


  return (
    <div className="max-w-2xl mx-auto">
      <BasicInfoForm
        roles={user?.roles || []}
        onSubmit={handleSubmit}
        defaultValues={getDefaultValues()}
      />
    </div>
  );
}