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

export const Basic: Theme = Object.freeze({
  BorderRadius: 5,
  PrimaryColor: '#2185d0',
  SecondaryColor: '#767676',
  IncreaseColor: 'green',
  DecreaseColor: 'red',
  LightGray: '#eeeeee',
  Black: 'black',
  White: 'white',
  Gray: 'gray',
})

export const theme = Basic
