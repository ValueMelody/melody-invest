export interface Record {
  id: number;
  traderIds: number[];
}

export interface Identity extends Record {
  name: string;
  isSystem: boolean;
}

export interface Raw {
  id: number;
  traderIds: string;
}

export interface Create {
  traderIds: string;
}
