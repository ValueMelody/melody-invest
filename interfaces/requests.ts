export interface Auth {
  id: number;
  email: string;
}

export interface TraderEnvCreation {
  name: string;
  startDate: string;
  tickerIds: number[] | null;
}
