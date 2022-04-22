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
  holdings?: interfaces.traderHoldingModel.Detail[];
  oneYearTrends?: number[];
  totalValue?: number | null;
}

export interface Resources {
  tickerIdentities: {
    [tickerId: number]: interfaces.tickerModel.Identity;
  };
  tickerCategories: {
    [categoryId: number]: interfaces.tickerCategoryModel.Record;
  };
  userTraderIds: number[] | null;
  userTraderEnvs: interfaces.traderEnvModel.Record[];
  userTraderCombos: ComboDetail[];
  userType: number;
  userEmail: string,
}

export interface ProfileDetails {
  [traderId: number]: {
    trader: interfaces.traderModel.Record;
    pattern: interfaces.traderPatternModel.Public;
    profileEnvs?: interfaces.traderRes.ProfileEnv[];
    holdings?: interfaces.traderHoldingModel.Record[];
  };
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
  showRequestError: (err: any) => void;
  resources: Resources;
  setResources: vendorTool.react.Dispatch<React.SetStateAction<Resources>>;
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
