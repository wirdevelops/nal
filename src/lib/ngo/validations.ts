// @/lib/ngo/validations.ts

import {
    NgoProfileSchema,

} from "./types";


// For creating and updating an NGO profile, you'd use the same schema.

export const validateNgoProfile = (data: unknown) => NgoProfileSchema.safeParse(data);

// You *could* create separate schemas for create/update if needed, but often
// it's easier to use .partial() on the main schema for updates.
export const validateUpdateNgoProfile = (data: unknown) => NgoProfileSchema.partial().safeParse(data);