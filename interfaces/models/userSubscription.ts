export interface Record {
  id: number;
  userId: number;
  subscriptionId: string;
  status: number;
}

export interface Create {
  userId: number;
  subscriptionId: string;
  status: number;
}
