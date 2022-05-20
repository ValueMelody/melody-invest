export interface Record {
  id: string;
  sendTo: string;
  sendBy: string;
  title: string;
  content: string;
  createdAt: Date;
  sentAt: Date | null;
  status: number;
  response: object | null;
}

export interface Create {
  sendTo: string;
  sendBy: string;
  title: string;
  content: string;
  status: number;
}

export interface Update {
  status?: number;
  sentAt?: Date;
  response?: object;
}
