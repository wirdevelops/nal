// @/lib/ngo/errors.ts
export class NgoValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NgoValidationError";
    }
}

export class NgoNotFoundError extends Error {
    constructor(message: string = "NGO not found") {
        super(message);
        this.name = "NgoNotFoundError";
    }
}

// ... other NGO-specific errors