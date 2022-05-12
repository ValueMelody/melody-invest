export interface Record {
  id: string;
  sendTo: string;
  sendBy: string;
  content: string;
  createdAt: Date;
  sentAt: Date | null;
  isActive: boolean;
  isSuccess: boolean;
}

export interface Create {
  sendTo: string;
  sendBy: string;
  content: string;
  isActive: boolean;
  isSuccess: boolean;
}

export interface Update {
  isActive?: boolean;
  isSuccess?: boolean;
  sentAt?: Date;
}
