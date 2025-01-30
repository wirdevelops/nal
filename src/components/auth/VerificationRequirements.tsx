import { UserRole } from '@/types/user';
import { FileUpload } from '@/components/shared/FileUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ROLE_REQUIREMENTS: Record<UserRole, {
  documents: Array<{
    type: string;
    required: boolean;
    description: string;
    accept: string;
  }>;
  additionalInfo?: string;
}> = {
  'project-owner': {
    documents: [{
      type: 'business_registration',
      required: true,
      description: 'Business registration or company incorporation documents',
      accept: 'application/pdf,image/*'
    }]
  },
  'crew': {
    documents: [{
      type: 'certifications',
      required: false,
      description: 'Professional certifications or qualifications',
      accept: 'application/pdf,image/*'
    }]
  },
  'actor': {
    documents: [{
      type: 'headshots',
      required: true,
      description: 'Professional headshots (high resolution)',
      accept: 'image/*'
    }]
  },
  producer: {
    documents: [],
    additionalInfo: ''
  },
  vendor: {
    documents: [],
    additionalInfo: ''
  },
  ngo: {
    documents: [],
    additionalInfo: ''
  },
  admin: {
    documents: [],
    additionalInfo: ''
  }
};

export function VerificationRequirements({ role, onFileUpload }: {
  role: UserRole;
  onFileUpload: (type: string, files: File[]) => void;
}) {
  const requirements = ROLE_REQUIREMENTS[role];

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide the following verification documents for your {role} role
        </AlertDescription>
      </Alert>

      {requirements.documents.map((doc) => (
        <div key={doc.type} className="space-y-2">
          <p className="text-sm font-medium">
            {doc.description}
            {doc.required && <span className="text-destructive">*</span>}
          </p>
          <FileUpload
            accept={doc.accept}
            maxSize={10 * 1024 * 1024} // 10MB
            onUpload={async (files) => onFileUpload(doc.type, files)}
          />
        </div>
      ))}

      {requirements.additionalInfo && (
        <p className="text-sm text-muted-foreground">{requirements.additionalInfo}</p>
      )}
    </div>
  );
}