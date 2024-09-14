export const Type = Object.freeze({
  Guest: 0,
  Basic: 1,
  Pro: 2,
  Premium: 3,
})

export const PlanLimit = Object.freeze({
  Guest: {
    Profiles: 0,
    Envs: 0,
    Combos: 0,
    Tickers: 0,
  },
  Basic: {
    Profiles: 2,
    Envs: 1,
    Combos: 0,
    Tickers: 5,
  },
  Pro: {
    Profiles: 20,
    Envs: 3,
    Combos: 3,
    Tickers: 20,
  },
  Premium: {
    Profiles: 100,
    Envs: 10,
    Combos: 10,
    Tickers: 50,
  },
})
