import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useProjectStore } from '@/stores/useProjectStore';
import type { CommonFieldsData } from '@/types/common';
import type { ProjectTypeId } from '@/types/project-types';
import { ProjectCreationData } from '@/types/validation';
import { CommonFields } from './CommonFields';

import { getTypeSpecificFields } from './project-fields';
import { ThumbnailSelector } from './ThumbnailSelector';
import {Label} from '@/components/ui/label';

import { FileUpload } from '@/components/shared/FileUpload';

interface TypeSpecificDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: string | null;
  quickStartOption?: {
    id: string;
    primaryTool: string;
  } | null;
}

const formatProjectType = (type: string) => {
  if (!type) return 'Project';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function TypeSpecificProjectDialog({
  open,
  onOpenChange,
  selectedType,
  quickStartOption
}: TypeSpecificDialogProps) {
  const router = useRouter();
  const { addProject } = useProjectStore();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [commonData, setCommonData] = useState<CommonFieldsData>({
    title: '',
    description: '',
    startDate: null,
    targetDate: null
  });
  
  const [typeSpecificData, setTypeSpecificData] = useState({});

  const handleCommonDataChange = (data: Partial<CommonFieldsData>) => {
    setCommonData(prev => ({ ...prev, ...data }));
  };

  const handleTypeSpecificDataChange = (data: any) => {
    setTypeSpecificData(prev => ({ ...prev, ...data }));
  };

   // Add a function to handle the file selection
   const handleThumbnailSelect = async (file: File) => {
    setThumbnailFile(file);
    // You can also create an object URL for preview if needed
    setThumbnailUrl(URL.createObjectURL(file));
  };
  
  const handleSubmit = async () => {
    if (!commonData.title) return;
    
    try {
      setIsSubmitting(true);

      console.log('Creating project with data:', {
        ...commonData,
        type: selectedType as ProjectTypeId,
        typeData: typeSpecificData,
        primaryTool: quickStartOption?.primaryTool || 'overview'
      });

      const creationData: ProjectCreationData = {
        title: commonData.title,
        description: commonData.description || '',
        type: selectedType as ProjectTypeId,
        typeData: typeSpecificData,
        startDate: commonData.startDate,
        targetDate: commonData.targetDate,
        primaryTool: quickStartOption?.primaryTool || 'overview',
        thumbnailFile: thumbnailFile || undefined
      };
      
      const project = addProject(creationData);
      console.log('Project created:', project);
      onOpenChange(false);
      
      setTimeout(() => {
        router.push(`/projects/${project.id}`);
      }, 100);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Fields = getTypeSpecificFields(selectedType || '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Create {formatProjectType(selectedType || '')} Project
            {quickStartOption && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({quickStartOption.id})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <CommonFields
                data={commonData}
                onChange={handleCommonDataChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Project Thumbnail</Label>
              <FileUpload
      onFileSelect={handleThumbnailSelect}
      onRemove={() => {
        setThumbnailFile(null);
        setThumbnailUrl('');
      }}
      value={thumbnailUrl}
      accept="image/*"
      maxSize={2 * 1024 * 1024} // 2MB limit
      aspectRatio="16:9"
      showPreview
    />
              <p className="text-sm text-muted-foreground">
                Add a thumbnail image for your project (16:9 ratio recommended)
              </p>
            </div>

            <Separator />

            {Fields && (
              <div>
                <h3 className="text-lg font-medium mb-4">Project Details</h3>
                <Fields
                  data={typeSpecificData}
                  onChange={handleTypeSpecificDataChange}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!commonData.title || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { Label } from '@/components/ui/label';
// import { CommonFields } from './CommonFields';
// import { useProjectStore } from '@/stores/useProjectStore';
// import type { CommonFieldsData } from '@/types/common';
// import type { ProjectTypeId } from '@/types/project-types';
// import { ProjectCreationData } from '@/types/validation';
// import { getTypeSpecificFields } from './project-fields';
// import { FileUpload } from '@/components/shared/FileUpload';
// import { toast } from '@/hooks/use-toast'
// import { isDOMComponent } from 'react-dom/test-utils';

// interface TypeSpecificDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   selectedType: string | null;
//   quickStartOption?: {
//     id: string;
//     primaryTool: string;
//   } | null;
// }

// const formatProjectType = (type: string): string => {
//   if (!type) return 'Project';
//   return type
//     .split('_')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// export function TypeSpecificProjectDialog({
//   open,
//   onOpenChange,
//   selectedType,
//   quickStartOption
// }: TypeSpecificDialogProps) {
//   const router = useRouter();
//   const { addProject } = useProjectStore();
//   const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
//   const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [commonData, setCommonData] = useState<CommonFieldsData>({
//     title: '',
//     description: '',
//     startDate: null,
//     targetDate: null
//   });
  
//   const [typeSpecificData, setTypeSpecificData] = useState({});

//   const handleCommonDataChange = (data: Partial<CommonFieldsData>) => {
//     setCommonData(prev => ({ ...prev, ...data }));
//   };

//   const handleTypeSpecificDataChange = (data: any) => {
//     setTypeSpecificData(prev => ({ ...prev, ...data }));
//   };

//   const handleThumbnailSelect = async (file: File) => {
//     setThumbnailFile(file);
//     const url = URL.createObjectURL(file);
//     setThumbnailUrl(url);
//   };
  
//   const handleSubmit = async () => {
//     if (!commonData.title || !selectedType) {
//       toast({
//         title: "Error",
//         description: "Project title and type are required",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     setIsSubmitting(true);

//     try {
//       const creationData: ProjectCreationData = {
//         title: commonData.title,
//         description: commonData.description || '',
//         type: selectedType as ProjectTypeId,
//         typeData: typeSpecificData,
//         startDate: commonData.startDate,
//         targetDate: commonData.targetDate,
//         primaryTool: quickStartOption?.primaryTool || 'overview',
//         thumbnailFile: thumbnailFile || undefined
//       };
  
//       const result = await addProject(creationData);
      
//       if (result.success && result.project) {
//         onOpenChange(false);

//         toast({
//           title: "Success",
//           description: "Project created successfully"
//         });

//          // Wait a tick to ensure project is in store
//          await new Promise(resolve => setTimeout(resolve, 0));

//         router.push(`/projects/${result.project.id}`);

//       } else if (result.validationResult) {
//         const errors = result.validationResult.errors
//           .map(err => err.message)
//           .join('\n');
        
//         toast({
//           title: "Validation Error",
//           description: errors,
//           variant: "destructive"
//         });
//       }
//     } catch (error) {
//       console.error('Project creation error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create project. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!selectedType) return null;

//   const Fields = getTypeSpecificFields(selectedType);

//   // const Fields = selectedType ? getTypeSpecificFields(selectedType) : null;

//   return (
//     <Dialog 
//     open={open} 
//     onOpenChange={(isOpen) => {
//       // Don't allow closing while submitting
//       if (isSubmitting) return;
//       onOpenChange(isOpen);
//     }}
//     >
//       <DialogContent className="sm:max-w-[600px] h-[80vh]">
//         <DialogHeader>
//           <DialogTitle>
//             Create {selectedType ? formatProjectType(selectedType) : 'Project'} Project
//             {quickStartOption && (
//               <span className="text-sm font-normal text-muted-foreground ml-2">
//                 ({quickStartOption.id})
//               </span>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         <ScrollArea className="flex-1 pr-4">
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-4">Basic Information</h3>
//               <CommonFields
//                 data={commonData}
//                 onChange={handleCommonDataChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Project Thumbnail</Label>
//               <FileUpload
//                 onFileSelect={handleThumbnailSelect}
//                 onRemove={() => {
//                   setThumbnailFile(null);
//                   setThumbnailUrl('');
//                 }}
//                 value={thumbnailUrl}
//                 accept="image/*"
//                 maxSize={2 * 1024 * 1024}
//                 aspectRatio="16:9"
//                 showPreview
//               />
//               <p className="text-sm text-muted-foreground">
//                 Add a thumbnail image for your project (16:9 ratio recommended)
//               </p>
//             </div>

//             <Separator />

//             {Fields && (
//               <div>
//                 <h3 className="text-lg font-medium mb-4">Project Details</h3>
//                 <Fields
//                   data={typeSpecificData}
//                   onChange={handleTypeSpecificDataChange}
//                 />
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         <DialogFooter className="mt-6">
//           <Button 
//             variant="outline" 
//             onClick={() => onOpenChange(false)}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={!commonData.title || isSubmitting || !selectedType}
//           >
//             {isSubmitting ? (
//               <div className="flex items-center">
//                 <span className="mr-2">Creating...</span>
//               </div>
//             ) : (
//               "Create Project"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }