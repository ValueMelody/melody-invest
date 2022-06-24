import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'

export const StorageKey = Object.freeze({
  AuthToken: 'authToken',
})

export const Config = Object.freeze({
  OverallEnvId: 0,
  DefaultEnvId: 1,
})

export const Env = Object.freeze({
  ServerHost: process.env.REACT_APP_SERVER_HOST!,
  ServerType: process.env.REACT_APP_SERVER_TYPE!,
  Theme: process.env.REACT_APP_THEME!,
  PayPalClientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,
  PayPalProPlanId: process.env.REACT_APP_PAYPAL_PRO_PLAN_ID!,
  PayPalPremiumPlanId: process.env.REACT_APP_PAYPAL_PREMIUM_PLAN_ID!,
  ContactEmail: process.env.REACT_APP_CONTACT_EMAIL!,
})

export const Plan = Object.freeze({
  Basic: {
    Title: localeTool.t('common.basic'),
    Price: localeTool.t('pricing.basicPrice'),
    Services: [
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Basic.Profiles }),
      localeTool.t('pricing.basicEnvs'),
    ],
  },
  Pro: {
    Title: localeTool.t('common.pro'),
    Price: localeTool.t('pricing.proPrice'),
    Services: [
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Pro.Profiles }),
      localeTool.t('pricing.envsLimit', { num: constants.User.PlanLimit.Pro.Envs }),
      localeTool.t('pricing.combosLimit', { num: constants.User.PlanLimit.Pro.Combos }),
    ],
  },
  Premium: {
    Title: localeTool.t('common.premium'),
    Price: localeTool.t('pricing.premiumPrice'),
    Services: [
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Premium.Profiles }),
      localeTool.t('pricing.envsLimit', { num: constants.User.PlanLimit.Premium.Envs }),
      localeTool.t('pricing.combosLimit', { num: constants.User.PlanLimit.Premium.Combos }),
    ],
  },
})
