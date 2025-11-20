export interface PotteryImage {
  uri: string;
  title?: string;
}

export interface Pottery {
  clayType: ClayType;
  dateCreated: string;
  designType: DesignType;
  glazeType: GlazeType;
  id: string;
  potName: string;
  potStatus: PotStatus;
  imageUri?: string; // Deprecated: kept for backward compatibility
  images?: PotteryImage[]; // Array of up to 3 images with optional titles
  notificationId?: string; // ID of scheduled notification
  timerDays?: number; // Number of days for the timer (can be any number for custom timer)
  timerMinutes?: number; // Number of minutes for short timers (e.g., 2 minutes)
  timerTime?: string; // Time in HH:MM format for custom timer notification
  timerStartDate?: string; // ISO string of when timer was set
  notes?: string; // Optional notes about the pottery
}

export interface PotteryState {
  items: Pottery[];
  loading: boolean;
  error: string | null;
}

export type ClayType = 'Cinco Rojo' | 'Porcelain' | 'Cinco Blanco' | 'Buffalo Wallow' | 'Dark Chocolate' | 'Custom' | 'Other';
export type DesignType = 'Pot' | 'Vase' | 'Platter' | 'Mug' | 'Bowl' | 'Tile' | 'Other';
export type PotStatus = 'Finished' | 'In Progress' | 'Drying' | 'Firing';
export type GlazeType = 'Matte' | 'Gloss' | 'No Glaze';