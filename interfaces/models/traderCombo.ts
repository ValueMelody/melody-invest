import * as traderHolding from './traderHolding'

export interface Identity {
  id: number;
  name: string;
  traderEnvId: number;
  isSysten: boolean;
}

export interface Detail extends Identity {
  holdingDetails: traderHolding.Detail[]
}
