import React, { createContext, Dispatch } from 'react'
import * as interfaces from '@shared/interfaces'

export interface Common {
  isLoading: boolean;
}

export interface Resources {
  topTraders: interfaces.tradersResponse.Top | null;
}

export interface Traders {
  [key: number]: interfaces.tradersResponse.TraderSummary;
}

export interface Context {
  common: Common;
  startLoading: () => void;
  stopLoading: () => void;
  resources: Resources;
  setResources: Dispatch<React.SetStateAction<Resources>>;
  traders: Traders;
  setTraders: Dispatch<React.SetStateAction<Traders>>;
}

// @ts-ignore
export const store: React.Context<Context> = createContext({})
