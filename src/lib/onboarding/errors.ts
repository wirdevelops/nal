// src/lib/onboarding/errors.ts
export class OnboardingError extends Error {
    constructor(
      public readonly code: string,
      public readonly status: number,
      message: string
    ) {
      super(message);
      this.name = 'OnboardingError';
    }
  }
  
  export const handleOnboardingError = (error: unknown) => {
    if (error instanceof OnboardingError) {
      return error;
    }
    
    return new OnboardingError(
      'UNKNOWN_ERROR',
      500,
      'An unknown error occurred during onboarding'
    );
  };
  
  export const isStageValidationError = (error: unknown) => {
    return error instanceof OnboardingError && error.code === 'INVALID_STAGE';
  };