export interface CommonFieldsData {
    title: string;
    description: string;
    startDate: Date | null;
    targetDate: Date | null;
  }

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
