export interface Record {
  id: number;
  entityId: number;
  traderIds: number[];
}

export interface Identity extends Record {
  name: string;
}

export interface Raw {
  id: number;
  traderIds: string;
}

export interface Create {
  entityId: number;
  traderIds: string;
}
