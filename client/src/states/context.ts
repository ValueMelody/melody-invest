import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../tools/vendor'

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

export interface ComboDetail {
  identity: interfaces.traderComboModel.Identity;
  holdings: interfaces.traderHoldingModel.Detail[];
  traderIds: number[]
}

export interface Resources {
  tickerIdentities: TickerIdentities | null;
  userTraderIds: number[] | null;
  userTraderEnvs: interfaces.traderEnvModel.Record[];
  userTraderCombos: ComboDetail[];
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
  setResources: vendorTool.react.Dispatch<React.SetStateAction<Resources>>;
  traderProfiles: TraderProfiles;
  setTraderProfiles: vendorTool.react.Dispatch<React.SetStateAction<TraderProfiles>>;
  profileDetails: ProfileDetails;
  setProfileDetails: vendorTool.react.Dispatch<React.SetStateAction<ProfileDetails>>;
  behaviorDetails: BehaviorDetails;
  setBehaviorDetails: vendorTool.react.Dispatch<React.SetStateAction<BehaviorDetails>>;
  tickerDetails: TickerDetails;
  setTickerDetails: vendorTool.react.Dispatch<React.SetStateAction<TickerDetails>>;
  topProfiles: TopProfiles;
  setTopProfiles: vendorTool.react.Dispatch<React.SetStateAction<TopProfiles>>;
}

// @ts-ignore
const store: React.Context<Context> = vendorTool.react.createContext({})

export const context = store
