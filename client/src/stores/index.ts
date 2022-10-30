import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './global'
import contentReducer from './content'
import traderEnvReducer from './traderEnv'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    content: contentReducer,
    traderEnv: traderEnvReducer,
  },
  middleware: (getDefaultMddleWare) => getDefaultMddleWare({
    serializableCheck: false,
  }),
})

export type RootState = ReturnType<typeof store.getState>

declare global {
  type AppDispatch = typeof store.dispatch
}
