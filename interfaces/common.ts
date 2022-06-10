export interface Option {
  label: string;
  value: number;
}

export interface StringOption {
  label: string;
  value: string;
}

export interface Theme {
  BorderRadius: number;
  PrimaryColor: string;
  SecondaryColor: string;
  IncreaseColor: 'green' | 'red';
  DecreaseColor: 'green' | 'red';
  LightGray: string;
  Gray: string;
  Black: string;
  White: string;
}
