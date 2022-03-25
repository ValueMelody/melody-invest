import React, { createContext, Dispatch } from 'react'
import * as interfaces from '@shared/interfaces'

export interface Message {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc?: string;
}

export interface Common {
  userType: number;
  isLoading: boolean;
  messages: Message[];
}

interface TickerIdentities {
  [key: number]: interfaces.tickerProfileRes.TickerIdentity
}

export interface Resources {
  topProfiles: interfaces.traderProfileRes.TopProfiles | null;
  tickerIdentities: TickerIdentities | null;
  userTraderIds: number[] | null;
  systemTraderEnvIds: number[] | null;
}

export interface TraderEnvs {
  [key: number]: interfaces.traderEnvModel.Record;
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
  loadUserType: (type: number) => void;
  addMessage: (message: Message) => void;
  removeMessage: (id: number) => void;
  clearMessages: () => void;
  showRequestError: (message: string) => void;
  resources: Resources;
  setResources: Dispatch<React.SetStateAction<Resources>>;
  traderEnvs: TraderEnvs;
  setTraderEnvs: Dispatch<React.SetStateAction<TraderEnvs>>;
  traderProfiles: TraderProfiles;
  setTraderProfiles: Dispatch<React.SetStateAction<TraderProfiles>>;
  profileHoldings: ProfileHoldings;
  setProfileHoldings: Dispatch<React.SetStateAction<ProfileHoldings>>;
}

// @ts-ignore
const store: React.Context<Context> = createContext({})

export const context = store
