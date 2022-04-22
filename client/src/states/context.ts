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

interface TopTraderProfileIds {
  yearly: number[];
  pastYear: number[];
  pastQuarter: number[];
  pastMonth: number[];
  pastWeek: number[];
}

export interface TopTraderProfiles {
  [traderEnvId: number]: TopTraderProfileIds
}

export interface ComboProfile {
  identity: interfaces.traderComboModel.Identity;
  detail?: interfaces.response.ComboDetail
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
  comboProfiles: ComboProfile[];
  userType: number;
  userEmail: string,
}

export interface TraderProfiles {
  [traderId: number]: {
    trader: interfaces.traderModel.Record;
    pattern: interfaces.traderPatternModel.Public;
    profileEnvs?: interfaces.traderRes.ProfileEnv[];
    holdings?: interfaces.traderHoldingModel.Record[];
  };
}

export interface BehaviorDetail {
  tops: TopTraderProfileIds;
}

export interface BehaviorDetails {
  [key: string]: BehaviorDetail;
}

export interface TickerDetail {
  tops: TopTraderProfileIds;
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
  traderProfiles: TraderProfiles;
  setTraderProfiles: vendorTool.react.Dispatch<React.SetStateAction<TraderProfiles>>;
  behaviorDetails: BehaviorDetails;
  setBehaviorDetails: vendorTool.react.Dispatch<React.SetStateAction<BehaviorDetails>>;
  tickerDetails: TickerDetails;
  setTickerDetails: vendorTool.react.Dispatch<React.SetStateAction<TickerDetails>>;
  topTraderProfiles: TopTraderProfiles;
  setTopTraderProfiles: vendorTool.react.Dispatch<React.SetStateAction<TopTraderProfiles>>;
}

// @ts-ignore
const store: React.Context<Context> = vendorTool.react.createContext({})

export const context = store
