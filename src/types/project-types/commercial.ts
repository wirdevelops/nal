export interface CommercialData {
    client?: string;
    brand?: string;
    duration?: number;
    platform?: string[];
    targetAudience?: string;
    campaignObjectives?: string;
    deliverables?: string[];
    budget?: number;
    format?: 'tv' | 'digital' | 'social' | 'hybrid';
    isPartOfCampaign?: boolean;
    campaignName?: string;
  }
  