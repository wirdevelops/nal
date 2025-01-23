export interface AnimationData {
    style?: '2d' | '3d' | 'stop-motion' | 'mixed-media';
    technique?: string;
    targetAudience?: string;
    duration?: number;
    frameRate?: number;
    resolution?: string;
    characterCount?: number;
    backgroundCount?: number;
    softwareTools?: string[];
    renderingRequirements?: string;
    audioRequirements?: string;
    storyboardStatus?: 'not-started' | 'in-progress' | 'completed';
    riggingRequired?: boolean;
    specialEffects?: string;
    colorPalette?: string;
    assetLibrary?: boolean;
    styleGuide?: string;
    renderEngine?: string;
  }