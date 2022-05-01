export interface Record {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  activationCode: string | null;
  activationSentAt: Date | null;
  email: string;
  password: string;
  type: number;
}

export interface Create {
  activationCode: string;
  activationSentAt: Date;
  email: string;
  password: string;
  type: number;
}

export interface Update {
  activationCode?: string | null;
  activationSentAt?: Date | null;
  password?: string;
}
