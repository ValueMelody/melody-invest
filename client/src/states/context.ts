import React, { createContext, Dispatch } from 'react'
import * as interfaces from '@shared/interfaces'

export interface Common {
  isLoading: boolean;
}

export interface Resources {
  topProfiles: interfaces.traderProfileRes.TopProfiles | null;
}

export interface TraderProfiles {
  [key: number]: interfaces.traderProfileRes.TraderProfile;
}

export interface ProfileHoldings {
  [key: number]: interfaces.traderHoldingModel.Record[];
}

export interface Context {
  common: Common;
  startLoading: () => void;
  stopLoading: () => void;
  resources: Resources;
  setResources: Dispatch<React.SetStateAction<Resources>>;
  traderProfiles: TraderProfiles;
  setTraderProfiles: Dispatch<React.SetStateAction<TraderProfiles>>;
  profileHoldings: ProfileHoldings;
  setProfileHoldings: Dispatch<React.SetStateAction<ProfileHoldings>>;
}

// @ts-ignore
const store: React.Context<Context> = createContext({})

export const context = store
