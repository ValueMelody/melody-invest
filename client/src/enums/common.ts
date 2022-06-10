import * as localeTool from '../tools/locale'

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
      localeTool.t('pricing.basicProfiles'),
      localeTool.t('pricing.basicEnvs'),
    ],
  },
  Pro: {
    Title: localeTool.t('common.pro'),
    Price: localeTool.t('pricing.proPrice'),
    Services: [
      localeTool.t('pricing.proProfiles'),
      localeTool.t('pricing.proEnvs'),
      localeTool.t('pricing.proCombos'),
    ],
  },
  Premium: {
    Title: localeTool.t('common.premium'),
    Price: localeTool.t('pricing.premiumPrice'),
    Services: [
      localeTool.t('pricing.premiumProfiles'),
      localeTool.t('pricing.premiumEnvs'),
      localeTool.t('pricing.premiumCombos'),
    ],
  },
})
