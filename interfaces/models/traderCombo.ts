export interface Record {
  id: number;
  traderEnvId: number;
  traderIds: number[];
}

export interface Identity extends Record {
  name: string;
  isSystem: boolean;
}

export interface Raw {
  id: number;
  traderEnvId: number;
  traderIds: string;
}

export interface Create {
  traderEnvId: number;
  traderIds: string;
}
