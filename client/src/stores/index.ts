import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './global'
import contentReducer from './content'
import traderEnvReducer from './traderEnv'
import traderProfileReducer from './traderProfile'
import tickerCategoryReducer from './tickerCategory'
import tickerIdentityReducer from './tickerIdentity'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    content: contentReducer,
    traderEnv: traderEnvReducer,
    traderProfile: traderProfileReducer,
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
