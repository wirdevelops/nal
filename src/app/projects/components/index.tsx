'use client';

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
import { CommonFields, type CommonFieldsData } from './CommonFields';
import { FeatureFilmFields, type FeatureFilmData } from './FeatureFilm';
import { SeriesFields, type SeriesData } from './SeriesFields';
import { DocumentaryFields, type DocumentaryData } from './DocumentaryFields';

import { CommercialFields, type CommercialData } from './CommercialFields';
import { MusicVideoFields, type MusicVideoData } from './MusicVideoFields';
import { WebSeriesFields, type WebSeriesData } from './WebSeriesFields';
import { AnimationFields, type AnimationData } from './AnimationFields';


interface TypeSpecificDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectType: string;
  quickStartOption?: {
    id: string;
    primaryTool: string;
  } | null;
}

type TypeSpecificData = {
    feature: FeatureFilmData;
    series: SeriesData;
    documentary: DocumentaryData;
    commercial: CommercialData;
    music_video: MusicVideoData;
    web_series: WebSeriesData;
    animation: AnimationData;
  };


  export function TypeSpecificDialog({
    open,
    onOpenChange,
    projectType,
    quickStartOption
  }: TypeSpecificDialogProps) {
    const router = useRouter();
    const { addProject } = useProjectStore();
  
    const [commonData, setCommonData] = useState<CommonFieldsData>({
      title: '',
      description: '',
      startDate: null,
      targetDate: null
    });
  
    const [typeSpecificData, setTypeSpecificData] = useState<Partial<TypeSpecificData[keyof TypeSpecificData]>>({});
  
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleCommonDataChange = (data: Partial<CommonFieldsData>) => {
      setCommonData(prev => ({ ...prev, ...data }));
    };
  
    const handleTypeSpecificDataChange = (data: Partial<TypeSpecificData[keyof TypeSpecificData]>) => {
      setTypeSpecificData(prev => ({ ...prev, ...data }));
    };
  
    const handleSubmit = async () => {
      if (!commonData.title) return;
      
      try {
        setIsSubmitting(true);
  
        const newProject = {
          title: commonData.title,
          description: commonData.description || '',
          type: projectType,
          phase: 'Development',
          status: 'active' as const,
          team: 0,
          progress: 0,
          startDate: commonData.startDate?.toISOString() || new Date().toISOString(),
          targetDate: commonData.targetDate?.toISOString(),
          primaryTool: quickStartOption?.primaryTool || 'overview',
          typeData: typeSpecificData
        };
  
        const project = addProject(newProject);
        onOpenChange(false);
        router.push(`/projects/${project.id}/${newProject.primaryTool}`);
      } catch (error) {
        console.error('Failed to create project:', error);
        // Here you could add toast notification for error
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const getProjectTypeTitle = (type: string) => {
      return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
  
    const renderTypeSpecificFields = () => {
        switch (projectType) {
          case 'feature':
            return (
              <FeatureFilmFields
                data={typeSpecificData as FeatureFilmData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'series':
            return (
              <SeriesFields
                data={typeSpecificData as SeriesData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'documentary':
            return (
              <DocumentaryFields
                data={typeSpecificData as DocumentaryData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'commercial':
            return (
              <CommercialFields
                data={typeSpecificData as CommercialData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'music_video':
            return (
              <MusicVideoFields
                data={typeSpecificData as MusicVideoData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'web_series':
            return (
              <WebSeriesFields
                data={typeSpecificData as WebSeriesData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          case 'animation':
            return (
              <AnimationFields
                data={typeSpecificData as AnimationData}
                onChange={handleTypeSpecificDataChange}
              />
            );
          default:
            return null;
        }
      };
    
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                Create {getProjectTypeTitle(projectType)} Project
                {quickStartOption && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({quickStartOption.id})
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
    
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Common Fields */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <CommonFields
                    data={commonData}
                    onChange={handleCommonDataChange}
                  />
                </div>
    
                <Separator />
    
                {/* Type Specific Fields */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Project Details</h3>
                  {renderTypeSpecificFields()}
                </div>
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