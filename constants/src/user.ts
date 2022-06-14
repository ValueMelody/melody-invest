export const Type = Object.freeze({
  Guest: 0,
  Basic: 1,
  Pro: 2,
  Premium: 3,
})

export const SubscriptionStatus = Object.freeze({
  Active: 1,
  Suspended: 2,
  Cancelled: 3,
})

export const PlanLimit = Object.freeze({
  Basic: {
    Profiles: 5,
    Envs: 0,
    Combos: 0,
  },
  Pro: {
    Profiles: 30,
    Envs: 3,
    Combos: 3,
  },
  Premium: {
    Profiles: 100,
    Envs: 10,
    Combos: 10,
  },
})
