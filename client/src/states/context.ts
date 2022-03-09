import React, { createContext, Dispatch } from 'react'

export interface Context {
  patterns?: {};
  setPatterns?: Dispatch<React.SetStateAction<{}>>;
}

export const context: React.Context<Context> = createContext({})
