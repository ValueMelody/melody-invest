export interface Record {
  id: number;
  dataKey: string | null;
  isValidKey: boolean | null;
}

export interface Create {}

export interface Update {
  dataKey?: string;
  isValidKey?: boolean;
}
