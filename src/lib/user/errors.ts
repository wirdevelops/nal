// @/lib/user/errors.ts

export class UserError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UserError';
    }
  }
  
  export class ProfileUpdateError extends UserError {
    constructor(message: string = 'Failed to update profile') {
      super(message);
      this.name = 'ProfileUpdateError';
    }
  }
  
  export class ActiveRoleError extends UserError {
    constructor(message: string = 'Failed to set active role') {
      super(message);
      this.name = 'ActiveRoleError';
    }
  }
  
  export class UserSettingsError extends UserError {
    constructor(message: string = 'Failed to update user settings') {
      super(message);
      this.name = 'UserSettingsError';
    }
  }
  
  export class AccountDeletionError extends UserError {
    constructor(message: string = 'Failed to delete account') {
      super(message);
      this.name = 'AccountDeletionError';
    }
  }