export interface Record {
  id: number;
  entityId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  activationCode: string | null;
  activationSentAt: Date | null;
  resetCode: string | null;
  resetSentAt: Date | null;
  email: string;
  password: string;
  type: number;
}

export interface Create {
  activationCode: string;
  activationSentAt: Date;
  entityId: number;
  email: string;
  password: string;
  type: number;
}

export interface Update {
  activationCode?: string | null;
  activationSentAt?: Date | null;
  resetCode?: string | null;
  resetSentAt?: Date | null;
  password?: string;
  type?: number;
  deletedAt?: Date | null;
}
