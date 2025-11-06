export interface Pottery {
  clayType: ClayType;
  dateCreated: string;
  designType: DesignType;
  glazeType: GlazeType;
  id: string;
  potName: string;
  potStatus: PotStatus;
}

export interface PotteryState {
  items: Pottery[];
}

export type ClayType = 'Cinco Rojo' | 'Porcelain' | 'Cinco Blanco' | 'Buffalo Wallow' | 'Dark Chocolate' | 'Custom' | 'Other';
export type DesignType = 'Pot' | 'Vase' | 'Platter' | 'Mug' | 'Bowl' | 'Other';
export type PotStatus = 'Finished' | 'In Progress' | 'Drying' | 'Firing';
export type GlazeType = 'Matte' | 'Gloss' | 'No Glaze';