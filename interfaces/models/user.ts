export interface Record {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  activationCode: string | null;
  activationSentAt: Date | null;
  email: string;
  password: string;
}

export interface Create {
  activationCode: string;
  activationSentAt: Date;
  email: string;
  password: string;
}

export interface Update {
  activationCode?: string;
  activationSentAt?: Date;
  email?: string;
}
