import React, { createContext, Dispatch } from 'react'
import * as interfaces from '@shared/interfaces'

export interface Common {
  isLoading: boolean;
}

export interface Resources {
  topPatterns: interfaces.resourcesResponse.TopPatterns | null;
}

export interface Traders {
  [key: number]: interfaces.traderPatternModel.Public
}

export interface Context {
  common: Common;
  setCommon: Dispatch<React.SetStateAction<Common>>;
  resources: Resources;
  setResources: Dispatch<React.SetStateAction<Resources>>;
  traders: Traders;
  setTraders: Dispatch<React.SetStateAction<Traders>>;
}

// @ts-ignore
export const store: React.Context<Context> = createContext({})
