export const Type = Object.freeze({
  Guest: 0,
  Basic: 1,
  Pro: 2,
  Premium: 3,
})

export const BillingTax = Object.freeze({
  State: {
    CA: {
      Province: {
        AB: 0.05,
        BC: 0.05,
        MB: 0.05,
        NB: 0.15,
        NL: 0.15,
        NT: 0.05,
        NS: 0.15,
        NU: 0.05,
        ON: 0.13,
        PE: 0.15,
        QC: 0.05,
        SK: 0.05,
        YT: 0.05,
      },
    },
    Other: {
      Province: {},
    },
  },
})

export const SubscriptionStatus = Object.freeze({
  Active: 1,
  Suspended: 2,
  Cancelled: 3,
})

export const PlanPrice = Object.freeze({
  Pro: {
    OneMonthPrice: '11.99',
    ThreeMonthsPrice: '34.99',
    SixMonthsPrice: '65.99',
    OneYearPrice: '119.99',
  },
  Premium: {
    OneMonthPrice: '19.99',
    ThreeMonthsPrice: '55.99',
    SixMonthsPrice: '105.99',
    OneYearPrice: '199.99',
  },
})

export const PlanLimit = Object.freeze({
  Guest: {
    Profiles: 0,
    Envs: 0,
    Combos: 0,
  },
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
