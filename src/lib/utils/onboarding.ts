import { OnboardingStage } from "../types";

// src/lib/utils/onboarding.ts
export const saveDraft = (stage: OnboardingStage, data: any) => {
    const drafts = JSON.parse(localStorage.getItem('onboardingDrafts') || '{}');
    drafts[stage] = data;
    localStorage.setItem('onboardingDrafts', JSON.stringify(drafts));
  };
  
  export const loadDraft = (stage: OnboardingStage) => {
    const drafts = JSON.parse(localStorage.getItem('onboardingDrafts') || '{}');
    return drafts[stage] || null;
  };