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

interface TopProfileIds {
  yearly: number[];
  pastYear: number[];
  pastQuarter: number[];
  pastMonth: number[];
  pastWeek: number[];
}

export interface TopProfiles {
  [traderEnvId: number]: TopProfileIds
}

export interface Resources {
  tickerIdentities: TickerIdentities | null;
  userTraderIds: number[] | null;
  userTraderEnvs: interfaces.traderEnvModel.Record[];
  userTraderCombos: interfaces.traderComboModel.Detail[];
  userType: number;
  userEmail: string,
}

export interface TraderProfiles {
  [traderId: number]: interfaces.traderRes.TraderProfile;
}

export interface ProfileDetails {
  [traderId: number]: interfaces.traderRes.ProfileDetail;
}

export interface BehaviorDetail {
  tops: TopProfileIds;
}

export interface BehaviorDetails {
  [key: string]: BehaviorDetail;
}

export interface TickerDetail {
  tops: TopProfileIds;
}

export interface TickerDetails {
  [key: string]: TickerDetail;
}

export interface ComboDetail {

}

export interface ComboDetails {
  [comboId: number]: ComboDetail;
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
  traderProfiles: TraderProfiles;
  setTraderProfiles: Dispatch<React.SetStateAction<TraderProfiles>>;
  profileDetails: ProfileDetails;
  setProfileDetails: Dispatch<React.SetStateAction<ProfileDetails>>;
  behaviorDetails: BehaviorDetails;
  setBehaviorDetails: Dispatch<React.SetStateAction<BehaviorDetails>>;
  tickerDetails: TickerDetails;
  setTickerDetails: Dispatch<React.SetStateAction<TickerDetails>>;
  topProfiles: TopProfiles;
  setTopProfiles: Dispatch<React.SetStateAction<TopProfiles>>;
  comboDetails: ComboDetails;
  setComboDetails: Dispatch<React.SetStateAction<ComboDetails>>;
}

// @ts-ignore
const store: React.Context<Context> = createContext({})

export const context = store
