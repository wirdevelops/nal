// /lib/profile/errors.ts

export class ProfileError extends Error {
    constructor(message: string, public status?: number) {
      super(message);
      this.name = 'ProfileError';
      this.status = status;
    }
  }
  
  export class ValidationError extends ProfileError {
    constructor(message: string) {
      super(message, 400); // Bad Request
      this.name = 'ValidationError';
    }
  }
  
  export class UnauthorizedError extends ProfileError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401); // Unauthorized
      this.name = 'UnauthorizedError';
    }
  }
  
  export class ForbiddenError extends ProfileError {
      constructor(message: string = "Forbidden") {
          super(message, 403);
          this.name = "ForbiddenError";
      }
  }
  
  export class NotFoundError extends ProfileError {
    constructor(message: string = 'Profile not found') {
      super(message, 404); // Not Found
      this.name = 'NotFoundError';
    }
  }
  
  export class ConflictError extends ProfileError {
    constructor(message: string = 'Profile already exists') {
      super(message, 409); // Conflict
      this.name = 'ConflictError';
    }
  }
  
  export class InternalServerError extends ProfileError {
    constructor(message: string = 'Internal server error') {
      super(message, 500); // Internal Server Error
      this.name = 'InternalServerError';
    }
  }
  
  // Helper function to handle API errors consistently
  export const handleApiError = (error: any): ProfileError => {
      if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          const message = data.message || error.message; // Prefer server message
  
          switch (status) {
              case 400:
                  return new ValidationError(message);
              case 401:
                  return new UnauthorizedError(message);
              case 403:
                  return new ForbiddenError(message);
              case 404:
                  return new NotFoundError(message);
              case 409:
                  return new ConflictError(message);
              case 500:
                  return new InternalServerError(message);
              default:
                  return new ProfileError(message, status);
          }
      } else if (error.request) {
          // The request was made but no response was received
          return new ProfileError('No response received from server');
      } else {
          // Something happened in setting up the request that triggered an Error
          return new ProfileError(error.message);
      }
  };


// // @/lib/profile/errors.ts
// export class ProfileError extends Error {
//     constructor(message: string) {
//         super(message);
//         this.name = "ProfileError";
//     }
// }

// export class ProfileValidationError extends Error {
//      constructor(message: string) {
//         super(message);
//         this.name = "ProfileValidationError";
//     }
// }

// export class ProfileNotFoundError extends Error {
//     constructor(message: string = "Profile Not Found") {
//         super(message)
//         this.name = "ProfileNotFoundError"
//     }
// }