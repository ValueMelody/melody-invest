export interface Record {
  id: number;
  activeTotal: number;
  isSystem: boolean;
  name: string | null
  startDate: string | null;
  tickerIds: string | null;
}
