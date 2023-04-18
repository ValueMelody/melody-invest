export interface Record {
  id: number;
  entityId: number;
  activeTotal: number;
  startDate: string;
  tickerIds: number[] | null;
}

export interface Identity extends Record {
  name: string;
}

export interface Raw {
  id: number;
  entityId: number;
  activeTotal: number;
  startDate: string;
  tickerIds: string | null;
}

export interface Create {
  entityId: number;
  activeTotal: number;
  startDate: string;
  tickerIds: string | null;
}
