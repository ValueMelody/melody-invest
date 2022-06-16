import * as interfaces from '@shared/interfaces'
import * as vendorTool from './tools/vendor'

export interface Message {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc?: string;
}

export interface Common {
  isLoading: boolean;
  messages: Message[];
  activeChartIndex: number;
}

interface TopTraderProfileIds {
  yearly: number[];
  pastYear: number[];
  pastQuarter: number[];
  pastMonth: number[];
  pastWeek: number[];
}

export interface Resources {
  tickerIdentities: {
    [tickerId: number]: interfaces.tickerModel.Identity;
  };
  tickerCategories: {
    [categoryId: number]: interfaces.tickerCategoryModel.Record;
  };
  hasLogin: boolean;
  userTraderIds: number[];
  userType: number;
  userEmail: string,
  planStartAtUTC: string | null;
  planEndAtUTC: string | null;
  overallTopTraderProfiles: TopTraderProfileIds | null,
}

export interface TraderProfiles {
  [traderId: number]: {
    trader: interfaces.traderModel.Record;
    pattern: interfaces.traderPatternModel.Public;
    profileEnvs?: interfaces.response.ProfileEnv[];
    holdings?: interfaces.traderHoldingModel.Record[];
  };
}

export interface TraderCombo {
  identity: interfaces.traderComboModel.Identity,
  detail?: interfaces.response.ComboDetail;
}

export interface TraderCombos {
  [key: number]: TraderCombo;
}

export interface TraderBehavior {
  tops: TopTraderProfileIds;
}

export interface TraderBehaviors {
  [key: string]: TraderBehavior;
}

export interface TraderTicker {
  tops: TopTraderProfileIds;
}

export interface TraderTickers {
  [key: string]: TraderTicker;
}

export interface TraderEnv {
  record: interfaces.traderEnvModel.Record,
  tops?: TopTraderProfileIds;
}

export interface TraderEnvs {
  [key: number]: TraderEnv;
}

export interface Context {
  common: Common;
  setCommon: vendorTool.react.Dispatch<React.SetStateAction<Common>>;
  startLoading: () => void;
  stopLoading: () => void;
  addMessage: (message: Message) => void;
  removeMessage: (id: number) => void;
  clearMessages: (option?: { onlyErrors: boolean }) => void;
  showRequestError: (err: any) => void;
  cleanUserState: () => void;
  resources: Resources;
  setResources: vendorTool.react.Dispatch<React.SetStateAction<Resources>>;
  traderProfiles: TraderProfiles;
  setTraderProfiles: vendorTool.react.Dispatch<React.SetStateAction<TraderProfiles>>;
  traderBehaviors: TraderBehaviors;
  setTraderBehaviors: vendorTool.react.Dispatch<React.SetStateAction<TraderBehaviors>>;
  traderTickers: TraderTickers;
  setTraderTickers: vendorTool.react.Dispatch<React.SetStateAction<TraderTickers>>;
  traderEnvs: TraderEnvs;
  setTraderEnvs: vendorTool.react.Dispatch<React.SetStateAction<TraderEnvs>>;
  traderCombos: TraderCombos;
  setTraderCombos: vendorTool.react.Dispatch<React.SetStateAction<TraderCombos>>;
}

// @ts-ignore
const store: React.Context<Context> = vendorTool.react.createContext({})

export const context = store
