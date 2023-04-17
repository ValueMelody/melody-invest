export interface Record {
  id: number;
  entityId: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null;
  startDate: string;
  tickerIds: number[] | null;
}

export interface Raw {
  id: number;
  entityId: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null;
  startDate: string;
  tickerIds: string | null;
}

export interface Create {
  entityId: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null;
  startDate: string;
  tickerIds: string | null;
}
