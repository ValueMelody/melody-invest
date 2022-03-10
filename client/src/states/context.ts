import React, { createContext, Dispatch } from 'react'

export interface Context {
  common: {
    isLoading: boolean;
  };
  setCommon: Dispatch<React.SetStateAction<{
    isLoading: boolean;
  }>>;
}

// @ts-ignore
export const context: React.Context<Context> = createContext({})
