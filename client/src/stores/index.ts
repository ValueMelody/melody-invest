import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './global'
import contentReducer from './content'
import traderEnvReducer from './traderEnv'
import tickerIdentityReducer from './tickerIdentity'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    content: contentReducer,
    traderEnv: traderEnvReducer,
    tickerIdentity: tickerIdentityReducer,
  },
  middleware: (getDefaultMddleWare) => getDefaultMddleWare({
    serializableCheck: false,
  }),
})

declare global {
  type AppState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
}
