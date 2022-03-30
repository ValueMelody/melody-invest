export interface Record {
  id: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null
  startDate: string;
  tickerIds: number[] | null;
}

export interface Raw {
  id: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null
  startDate: string;
  tickerIds: string | null;
}

export interface Create {
  activeTotal: number;
  isSystem: boolean;
  name: string | null
  startDate: string;
  tickerIds: string | null;
}
