export interface Record {
  id: string;
  sendTo: string;
  sendBy: string;
  content: string;
  createdAt: Date;
  sentAt: Date | null;
  isActive: boolean;
  status: number;
}

export interface Create {
  sendTo: string;
  sendBy: string;
  content: string;
  isActive: boolean;
  status: number;
}

export interface Update {
  isActive?: boolean;
  status?: number;
  sentAt?: Date;
}
