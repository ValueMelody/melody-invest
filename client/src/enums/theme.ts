export interface Theme {
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  INCREASE_COLOR: 'green' | 'red';
  DECREASE_COLOR: 'green' | 'red';
  SPACING: number;
  BORDER_RADIUS: number;
}

export const BASIC: Theme = {
  PRIMARY_COLOR: '#2185d0',
  SECONDARY_COLOR: '#767676',
  INCREASE_COLOR: 'green',
  DECREASE_COLOR: 'red',
  SPACING: 16,
  BORDER_RADIUS: 4,
}

export const theme = process.env.REACT_APP_THEME === 'basic' ? BASIC : BASIC
