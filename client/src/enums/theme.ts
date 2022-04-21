export interface Theme {
  PrimaryColor: string;
  SecondaryColor: string;
  IncreaseColor: 'green' | 'red';
  DecreaseColor: 'green' | 'red';
}

export const Basic: Theme = Object.freeze({
  PrimaryColor: '#2185d0',
  SecondaryColor: '#767676',
  IncreaseColor: 'green',
  DecreaseColor: 'red',
})

export const theme = process.env.REACT_APP_THEME === 'basic' ? Basic : Basic
