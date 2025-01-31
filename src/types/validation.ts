import { ProjectTypeId } from "./project-types";

export interface ValidationError {
    field: string;
    message: string;
  }
  
  export type ValidationResult = {
    isValid: boolean;
    errors: ValidationError[];
  };
  
  // For project creation specifically
  export interface ProjectCreationData {
    title: string;
    description?: string;
    type: ProjectTypeId;
    thumbnailFile?: File;
    typeData?: Record<string, unknown>;
    startDate?: Date;
    targetDate?: Date;
    primaryTool?: string;
  }