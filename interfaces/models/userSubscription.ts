export interface Record {
  id: number;
  userId: number;
  subscriptionId: string;
  status: number;
  startAtUTC: string;
  endAtUTC: string | null;
}

export interface Create {
  userId: number;
  subscriptionId: string;
  status: number;
  startAtUTC: string;
}

export interface Update {
  status: number;
  endAtUTC: string;
}
