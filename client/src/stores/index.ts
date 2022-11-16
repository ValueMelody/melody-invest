import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './content'
import globalReducer from './global'
import tickerCategoryReducer from './tickerCategory'
import tickerIdentityReducer from './tickerIdentity'
import traderBehaviorReducer from './traderBehavior'
import traderComboReducer from './traderCombo'
import traderEnvReducer from './traderEnv'
import traderProfileReducer from './traderProfile'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    content: contentReducer,
    user: userReducer,
    traderCombo: traderComboReducer,
    traderEnv: traderEnvReducer,
    traderProfile: traderProfileReducer,
    traderBehavior: traderBehaviorReducer,
    tickerCategory: tickerCategoryReducer,
    tickerIdentity: tickerIdentityReducer,
  },
  middleware: (getDefaultMddleWare) => getDefaultMddleWare({
    serializableCheck: false,
  }),
})

declare global {
  type AppState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch

  interface TopTraderProfileIds {
    yearly: number[];
    pastYear: number[];
    pastQuarter: number[];
    pastMonth: number[];
    pastWeek: number[];
  }
}
