import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Volunteer } from '@/types/ngo';
import { BackgroundCheck, Skill } from '@/types/ngo';

interface VolunteerProfileProps {
  volunteer: Volunteer;
  projects: Array<{ id: string; name: string }>; // Basic project info
  onEditProfile?: () => void;
}

export function VolunteerProfile({
  volunteer,
  projects,
  onEditProfile
}: VolunteerProfileProps) {
  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const totalHours = volunteer.hours.reduce((sum, log) => sum + log.hours, 0);
  const verifiedHours = volunteer.hours.filter(log => log.verified).reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">
                    {volunteer.firstName} {volunteer.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                    Member since {formatDate(volunteer.createdAt)}
                  </p>
                </div>
                {onEditProfile && (
                  <Button onClick={onEditProfile}>Edit Profile</Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBadge
                  icon={<Clock className="w-4 h-4" />}
                  label="Total Hours"
                  value={totalHours}
                  subValue={`${verifiedHours} verified`}
                />
                <StatBadge
                  icon={<UserCheck className="w-4 h-4" />}
                  label="Projects"
                  value={volunteer.projects.length}
                />
                <StatBadge
                  icon={<Calendar className="w-4 h-4" />}
                  label="Availability"
                  value={`${volunteer.availability.days.length} days`}
                />
                <StatBadge
                  icon={<CheckCircle className="w-4 h-4" />}
                  label="Background Check"
                  value={
                    <Badge variant={
                      volunteer.background === BackgroundCheck.APPROVED 
                        ? 'default' 
                        : 'destructive'
                    }>
                      {volunteer.background.replace('_', ' ')}
                    </Badge>
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email">
              {volunteer.email}
            </InfoRow>
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone">
              {volunteer.phone || 'Not provided'}
            </InfoRow>
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location">
              {volunteer.location ? (
                <>
                  {volunteer.location.city}, {volunteer.location.state}<br />
                  {volunteer.location.country}
                </>
              ) : 'Not provided'}
            </InfoRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary"
                  className="capitalize"
                >
                  {skill.toLowerCase().replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Days">
              {volunteer.availability.days.join(', ') || 'Not specified'}
            </InfoRow>
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Hours">
              {volunteer.availability.startTime} - {volunteer.availability.endTime}
            </InfoRow>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Time Tracking</span>
            <span className="text-muted-foreground text-sm">
              {totalHours}h total ({verifiedHours}h verified)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {volunteer.hours.map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">
                  {formatDate(log.date)}
                  {log.projectId && (
                    <span className="text-muted-foreground text-sm ml-2">
                      ({projects.find(p => p.id === log.projectId)?.name || 'Unknown Project'})
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {log.notes || 'No additional notes'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={log.verified ? 'default' : 'outline'}>
                  {log.verified ? 'Verified' : 'Pending'}
                </Badge>
                <span className="text-xl font-bold">{log.hours}h</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Training & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {volunteer.trainings.map(training => (
            <div key={training.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">{training.name}</h3>
                {training.expirationDate && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {formatDate(training.expirationDate)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Progress 
                  value={training.completed ? 100 : 0}
                  className="w-32 h-2"
                />
                <Badge variant={training.completed ? 'default' : 'secondary'}>
                  {training.completed ? 'Completed' : 'Incomplete'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {volunteer.references.map(reference => (
            <div key={reference.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{reference.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {reference.relationship}
                  </p>
                </div>
                <Badge variant={reference.status === 'verified' ? 'default' : 'outline'}>
                  {reference.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm">
                Contact: {reference.contact}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
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