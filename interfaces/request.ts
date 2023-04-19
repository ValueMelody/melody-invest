export interface Auth {
  id: number;
  entityId: number;
  email: string;
  type: number;
}

export interface TickerCreation {
  symbol: string;
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
