export interface Record {
  id: number;
  userId: number;
  orderId: string;
  price: string;
  tax: string;
  stateCode: string | null;
  provinceCode: string | null;
  startAtUTC: string;
  endAtUTC: string;
}

export interface Create {
  userId: number;
  orderId: string;
  price: string;
  tax: string;
  stateCode: string | null;
  provinceCode: string | null;
  startAtUTC: string;
  endAtUTC: string;
}
