export interface Record {
  id: number;
  dataSource: string | null;
  dataKey: string | null;
  isValidKey: boolean | null;
}

export interface Create {}

export interface Update {
  dataSource?: string;
  dataKey?: string;
  isValidKey?: boolean;
}
