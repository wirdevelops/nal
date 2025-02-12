// @/lib/profile/types.ts
import { ObjectId } from 'mongodb';

// Base interfaces for all profiles
export interface BaseProfile {
  id?: ObjectId;
  userId: ObjectId;
  role: string;
  skills?: string[];
  experience?: Experience[];
  portfolio?: string[];
  availability?: Date;
  location?: string;
  bio?: string;
  website?: string;
  socialMedia?: SocialMedia;
  phone?: string;
  verificationData?: VerificationData;
}

export interface Experience {
  title: string;
  role: string;
  duration: string;
  description?: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface VerificationData {
  identificationType?: 'id-card' | 'passport' | 'driver-license';
  identificationNumber?: string;
  issuingAuthority?: string;
  dateOfIssue?: string;
  expiryDate?: string;
  proofOfAddress?: string;
}

// Specific Profile Types
export interface ActorProfile extends BaseProfile {
  actingStyles?: string[];
  reels?: string[];
  unionStatus?: string;
  headshot?: string;
}

export interface AdminProfile extends BaseProfile {
  accessLevel: 'super-admin' | 'content-admin' | 'user-admin' | 'financial-admin';
  managedSections?: string[];
  lastAudit?: Date;
  permissions?: Record<string, string>;
}

export interface CrewProfile extends BaseProfile {
  department: string;
  certifications?: string[];
  equipment?: string[];
}

export interface NgoProfile extends BaseProfile {
  organizationName: string;
  registrationNumber: string;
  focusAreas?: string[];
  partners?: Partner[];
  impactMetrics?: Record<string, number>;
  hoursLogged?: number;
  background?: string;
  annualBudget?: number;
}

export interface Partner {
  name: string;
  type: 'corporate' | 'government' | 'non-profit' | 'individual';
  partnershipLevel?: 'strategic' | 'financial' | 'operational';
  contactPerson?: string;
  contactEmail?: string;
}

export interface ProducerProfile extends BaseProfile {
  companyName: string;
  projects?: Project[];
  collaborations?: Collaboration[];
  unionAffiliations?: string[];
  insuranceInformation?: string;
}

export interface Project {
  id?: ObjectId;
  title: string;
  genre: string;
  productionType: 'film' | 'tv' | 'commercial' | 'theater' | 'web-series' | 'podcast' | 'other';
  status: 'development' | 'pre-production' | 'production' | 'post-production' | 'released';
  budgetRange?: string;
  filmingLocations?: string[];
  synopsis?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Collaboration {
  collaboratorId: ObjectId;
  role: string;
  projectId: ObjectId;
}

export interface ProjectOwnerProfile extends BaseProfile {
  organization: string;
  specialties?: string[];
  imdbLink?: string;
  currentProjects?: CurrentProject[];
  pastProjects?: PastProject[];
  fundingSources?: string[];
}

export interface CurrentProject {
  id?: ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  requiredResources?: string[];
}

export interface PastProject {
  id?: ObjectId;
  title: string;
  outcome: string;
  impactMetrics?: Record<string, number>;
}

export interface VendorProfile extends BaseProfile {
  businessName: string;
  storeName?: string;
  sellerRating?: number;
  services?: string[];
  paymentMethods?: string[];
  inventory?: InventoryItem[];
}

export interface InventoryItem {
  category: string;
  items?: string[];
}

export interface VolunteerProfile extends BaseProfile {
  interests?: string[];
  hoursAvailable?: number;
  references?: Reference[];
}

export interface Reference {
  name: string;
  relationship: string;
  contact: string;
}

export interface BeneficiaryProfile extends BaseProfile {
  needs?: string[];
  caseHistory?: string;
}

export interface DonorProfile extends BaseProfile {
  donationTypes?: string[];
  givingHistory?: number[];
  taxId?: string;
  preferences?: string;
}

export interface PartnerProfile extends BaseProfile {
  partnershipType: 'corporate' | 'government' | 'non-profit' | 'individual';
  collaborationAreas?: string[];
  resources?: string;
}

export interface SellerProfile extends BaseProfile {
  sellerType: string;
  productsServices?: string[];
  ratings?: number[];
  salesHistory?: number;
}

export interface EmployeeProfile extends BaseProfile {
  department: string;
  jobTitle: string;
  startDate: Date;
  endDate?: Date;
  managerId?: string;
  references?: Reference[];
}