import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  UserCheck,
  BookOpen,
  AlertCircle,
  Briefcase,
  Palette,
  HeartHandshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/user';

interface MultiRoleProfileProps {
  user: User;
  onEditProfile?: () => void;
}

export function MultiRoleProfile({ user, onEditProfile }: MultiRoleProfileProps) {
  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="space-y-6">
      {/* Common Profile Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
                {onEditProfile && (
                  <Button onClick={onEditProfile}>Edit Profile</Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBadge
                  icon={<Mail className="w-4 h-4" />}
                  label="Contact"
                  value={user.email}
                />
                <StatBadge
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={user.location || 'Not specified'}
                />
                <StatBadge
                  icon={<CheckCircle className="w-4 h-4" />}
                  label="Verified"
                  value={user.isVerified ? 'Yes' : 'No'}
                />
                <StatBadge
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Roles"
                  value={user.roles.join(', ')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Sections */}
      {user.roles.includes('volunteer') && (
        <RoleSection title="Volunteer Profile" icon={<HeartHandshake className="w-5 h-5" />}>
          <VolunteerProfileSection profile={user.volunteerProfile} />
        </RoleSection>
      )}

      {user.roles.includes('seller') && (
        <RoleSection title="Seller Profile" icon={<Briefcase className="w-5 h-5" />}>
          <SellerProfileSection profile={user.sellerProfile} />
        </RoleSection>
      )}

      {user.roles.includes('creator') && (
        <RoleSection title="Creator Profile" icon={<Palette className="w-5 h-5" />}>
          <CreatorProfileSection profile={user.creatorProfile} />
        </RoleSection>
      )}

      {/* Common Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email">
            {user.email}
          </InfoRow>
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone">
            {user.phone || 'Not provided'}
          </InfoRow>
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location">
            {user.location || 'Not provided'}
          </InfoRow>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Section Component
const RoleSection = ({ title, icon, children }: { 
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

// Volunteer Profile Section Component
const VolunteerProfileSection = ({ profile }: { profile?: User['volunteerProfile'] }) => {
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InfoRow icon={<Clock className="w-4 h-4" />} label="Total Hours">
          {profile.hoursLogged}h
        </InfoRow>
        <InfoRow icon={<CheckCircle className="w-4 h-4" />} label="Background Check">
          <Badge variant={profile.background === 'APPROVED' ? 'default' : 'destructive'}>
            {profile.background}
          </Badge>
        </InfoRow>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {profile.skills.map(skill => (
          <Badge key={skill} variant="secondary" className="capitalize">
            {skill.toLowerCase().replace('_', ' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Seller Profile Section Component
const SellerProfileSection = ({ profile }: { profile?: User['sellerProfile'] }) => {
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Store Name">
          {profile.storeName || 'Not specified'}
        </InfoRow>
        <InfoRow icon={<CheckCircle className="w-4 h-4" />} label="Seller Rating">
          {profile.sellerRating}/5
        </InfoRow>
      </div>
      <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Payment Methods">
        {profile.paymentMethods.join(', ') || 'No methods added'}
      </InfoRow>
    </div>
  );
};

// Creator Profile Section Component
const CreatorProfileSection = ({ profile }: { profile?: User['creatorProfile'] }) => {
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InfoRow icon={<Palette className="w-4 h-4" />} label="Specialties">
          {profile.specialties.join(', ')}
        </InfoRow>
        <InfoRow icon={<CheckCircle className="w-4 h-4" />} label="Portfolio Items">
          {profile.portfolio?.length || 0}
        </InfoRow>
      </div>
      {profile.imdbLink && (
        <InfoRow icon={<AlertCircle className="w-4 h-4" />} label="IMDB Profile">
          <a href={profile.imdbLink} className="text-primary underline">
            View Profile
          </a>
        </InfoRow>
      )}
    </div>
  );
};

const StatBadge = ({ icon, label, value, subValue }: { 
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    subValue?: string;
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-lg font-semibold">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  );

  const InfoRow = ({ icon, label, children }: { 
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-start gap-4">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );