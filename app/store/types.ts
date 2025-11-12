export interface Pottery {
  clayType: ClayType;
  dateCreated: string;
  designType: DesignType;
  glazeType: GlazeType;
  id: string;
  potName: string;
  potStatus: PotStatus;
  notificationId?: string; // ID of scheduled notification
  timerDays?: number; // Number of days for the timer (1, 2, or 3)
  timerStartDate?: string; // ISO string of when timer was set
}

export interface PotteryState {
  items: Pottery[];
  loading: boolean;
  error: string | null;
}

export type ClayType = 'Cinco Rojo' | 'Porcelain' | 'Cinco Blanco' | 'Buffalo Wallow' | 'Dark Chocolate' | 'Custom' | 'Other';
export type DesignType = 'Pot' | 'Vase' | 'Platter' | 'Mug' | 'Bowl' | 'Other';
export type PotStatus = 'Finished' | 'In Progress' | 'Drying' | 'Firing';
export type GlazeType = 'Matte' | 'Gloss' | 'No Glaze';