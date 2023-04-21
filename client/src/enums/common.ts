import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'

export const StorageKey = Object.freeze({
  AccessToken: 'accessToken',
  AccessExpiresIn: 'accessExpiresIn',
  RefreshToken: 'refreshToken',
  RefreshExpiresIn: 'refreshExpiresIn',
})

export const Config = Object.freeze({
  OverallEnvId: 0,
  DefaultEnvId: 1,
})

export const Env = Object.freeze({
  ServerHost: process.env.REACT_APP_SERVER_HOST!,
  ServerType: process.env.REACT_APP_SERVER_TYPE!,
  PayPalClientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,
  ContactEmail: process.env.REACT_APP_CONTACT_EMAIL!,
  IsMaintaining: process.env.REACT_APP_IS_MAINTAINING === 'true',
})

export const Plan = Object.freeze({
  Basic: {
    Title: localeTool.t('plan.basic'),
    Price: localeTool.t('pricing.basicPrice'),
    Services: [
      localeTool.t('pricing.tickersLimit', { num: constants.User.PlanLimit.Basic.Tickers }),
      localeTool.t('pricing.envsLimit', { num: constants.User.PlanLimit.Basic.Envs }),
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Basic.Profiles }),
    ],
  },
  Pro: {
    Title: localeTool.t('plan.pro'),
    Price: localeTool.t('pricing.planPrice', { num: constants.User.PlanPrice.Pro.OneMonthPrice }),
    Services: [
      localeTool.t('pricing.tickersLimit', { num: constants.User.PlanLimit.Pro.Tickers }),
      localeTool.t('pricing.envsLimit', { num: constants.User.PlanLimit.Pro.Envs }),
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Pro.Profiles }),
      localeTool.t('pricing.combosLimit', { num: constants.User.PlanLimit.Pro.Combos }),
    ],
  },
  Premium: {
    Title: localeTool.t('plan.premium'),
    Price: localeTool.t('pricing.planPrice', { num: constants.User.PlanPrice.Premium.OneMonthPrice }),
    Services: [
      localeTool.t('pricing.tickersLimit', { num: constants.User.PlanLimit.Premium.Tickers }),
      localeTool.t('pricing.envsLimit', { num: constants.User.PlanLimit.Premium.Envs }),
      localeTool.t('pricing.profilesLimit', { num: constants.User.PlanLimit.Premium.Profiles }),
      localeTool.t('pricing.combosLimit', { num: constants.User.PlanLimit.Premium.Combos }),
    ],
  },
})
