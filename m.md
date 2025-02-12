# Onboarding UI File Structure

```
src/
├── app/
│   └── onboarding/
│       ├── layout.tsx              # Main onboarding layout with progress tracking
│       ├── page.tsx                # Welcome screen (entry point)
│       ├── basic-info/
│       │   └── page.tsx            # Basic information form page
│       ├── role-selection/
│       │   └── page.tsx            # Role selection page
│       ├── role-details/
│       │   └── page.tsx            # Role-specific details page
│       └── verification/
│           └── page.tsx            # ID verification page
│
├── components/
│   ├── onboarding/
│   │   ├── layout/
│   │   │   ├── ProgressTracker.tsx # Progress indicator component
│   │   │   └── StageWrapper.tsx    # Common wrapper for all stages
│   │   │
│   │   ├── stages/
│   │   │   ├── WelcomeScreen.tsx   # Initial welcome screen
│   │   │   ├── BasicInfoForm.tsx   # Personal information form
│   │   │   ├── RoleSelection.tsx   # Role selection interface
│   │   │   ├── RoleDetails.tsx     # Role-specific details form
│   │   │   └── Verification.tsx    # Document upload and verification
│   │   │
│   │   └── shared/
│   │       ├── StageHeader.tsx     # Common header for stages
│   │       ├── StageNavigation.tsx # Next/Back navigation
│   │       └── FormWrapper.tsx     # Common form wrapper
│   │
│   └── ui/                         # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── FileUpload.tsx
│
├── lib/
│   ├── onboarding/
│   │   ├── types.ts                # Onboarding-related type definitions
│   │   ├── store.ts                # Onboarding state management
│   │   ├── hooks.ts                # Custom hooks for onboarding
│   │   ├── constants.ts            # Onboarding constants and configs
│   │   └── validation.ts           # Form validation schemas
│   │
│   └── api/
│       └── onboarding.ts           # API calls for onboarding
│
└── styles/
    └── onboarding.css              # Onboarding-specific styles
```

## Key Components and Their Purposes

### Layout Components

- `layout.tsx`: Main layout wrapper with progress tracking
- `ProgressTracker.tsx`: Visual indicator of onboarding progress
- `StageWrapper.tsx`: Common wrapper providing consistent padding/margins

### Stage Components

- `WelcomeScreen.tsx`: Introduction and overview of the process
- `BasicInfoForm.tsx`: Personal information collection
- `RoleSelection.tsx`: User role selection interface
- `RoleDetails.tsx`: Role-specific information collection
- `Verification.tsx`: ID verification and document upload

### Shared Components

- `StageHeader.tsx`: Consistent headers across stages
- `StageNavigation.tsx`: Navigation between stages
- `FormWrapper.tsx`: Common form styling and error handling

### Utility Files

- `types.ts`: TypeScript interfaces and types
- `store.ts`: State management (Zustand store)
- `hooks.ts`: Custom React hooks
- `validation.ts`: Zod validation schemas
