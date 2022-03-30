import React, { createContext, Dispatch } from 'react'
import * as interfaces from '@shared/interfaces'

export interface Message {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc?: string;
}

export interface Common {
  isLoading: boolean;
  messages: Message[];
}

interface TickerIdentities {
  [tickerId: number]: interfaces.tickerModel.Identity;
}

interface TopProfiles {
  yearly: number[];
  pastYear: number[];
  pastQuarter: number[];
  pastMonth: number[];
  pastWeek: number[];
}

interface EnvTopProfiles {
  [traderEnvId: number]: TopProfiles
}

export interface Resources {
  envTopProfiles: EnvTopProfiles | null;
  tickerIdentities: TickerIdentities | null;
  userTraderIds: number[] | null;
  userTraderEnvIds: number[];
  userType: number;
  userEmail: string,
}

export interface TraderEnvs {
  [traderEnvId: number]: interfaces.traderEnvModel.Record;
}

export interface TraderProfiles {
  [traderId: number]: interfaces.traderRes.TraderProfile;
}

export interface ProfileDetails {
  [traderId: number]: interfaces.traderRes.ProfileDetail;
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
  profileDetails: ProfileDetails;
  setProfileDetails: Dispatch<React.SetStateAction<ProfileDetails>>;
}

// @ts-ignore
const store: React.Context<Context> = createContext({})

export const context = store
