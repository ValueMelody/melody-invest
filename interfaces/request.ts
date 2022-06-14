export interface Auth {
  id: number;
  email: string;
  type: number;
}

export interface TraderEnvCreation {
  name: string;
  startDate: string;
  tickerIds: number[] | null;
}

export interface TraderComboCreation {
  name: string;
  traderIds: number[];
}
