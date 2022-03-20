import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import * as themeConstant from '../../../constants/theme'
import BehaviorLabel from './BehaviorLabel'

const useStyles = createUseStyles({
  container: {
    marginTop: '1rem',
  },
  label: {
    marginBottom: '0.5rem !important',
  },
})

const PatternBehaviors = ({
  pattern,
}: {
  pattern: interfaces.traderPatternModel.Public;
}) => {
  const classes = useStyles()

  const buyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
    'priceDailyIncreaseBuy', 'priceDailyDecreaseBuy',
    'priceWeeklyIncreaseBuy', 'priceWeeklyDecreaseBuy',
    'priceMonthlyIncreaseBuy', 'priceMonthlyDecreaseBuy',
    'priceQuarterlyIncreaseBuy', 'priceQuarterlyDecreaseBuy',
    'priceYearlyIncreaseBuy', 'priceYearlyDecreaseBuy',
    'epsQuarterlyBeatsBuy', 'epsQuarterlyMissBuy',
    'profitQuarterlyIncreaseBuy', 'profitQuarterlyDecreaseBuy',
    'incomeQuarterlyIncreaseBuy', 'incomeQuarterlyDecreaseBuy',
    'revenueQuarterlyIncreaseBuy', 'revenueQuarterlyDecreaseBuy',
    'profitYearlyIncreaseBuy', 'profitYearlyDecreaseBuy',
    'incomeYearlyIncreaseBuy', 'incomeYearlyDecreaseBuy',
    'revenueYearlyIncreaseBuy', 'revenueYearlyDecreaseBuy',
    'inflationYearlyIncreaseBuy', 'inflationYearlyDecreaseBuy',
    'fundsRateMonthlyIncreaseBuy', 'fundsRateMonthlyDecreaseBuy',
    'thirtyYearsTreasuryMonthlyIncreaseBuy', 'thirtyYearsTreasuryMonthlyDecreaseBuy',
    'tenYearsTreasuryMonthlyIncreaseBuy', 'tenYearsTreasuryMonthlyDecreaseBuy',
    'inflationMonthlyIncreaseBuy', 'inflationMonthlyDecreaseBuy',
    'cpiMonthlyIncreaseBuy', 'cpiMonthlyDecreaseBuy',
    'consumerSentimentMonthlyIncreaseBuy', 'consumerSentimentMonthlyDecreaseBuy',
    'retailSalesMonthlyIncreaseBuy', 'retailSalesMonthlyDecreaseBuy',
    'durableGoodsMonthlyIncreaseBuy', 'durableGoodsMonthlyDecreaseBuy',
    'unemploymentRateMonthlyIncreaseBuy', 'unemploymentRateMonthlyDecreaseBuy',
    'nonfarmPayrollMonthlyIncreaseBuy', 'nonfarmPayrollMonthlyDecreaseBuy',
    'gdpYearlyChangeAboveBuy', 'gdpYearlyChangeBelowBuy',
    'gdpQuarterlyChangeAboveBuy', 'gdpQuarterlyChangeBelowBuy',
    'gdpQuarterlyYoYChangeAboveBuy', 'gdpQuarterlyYoYChangeBelowBuy',
  ]

  const sellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
    'priceDailyIncreaseSell', 'priceDailyDecreaseSell',
    'priceWeeklyIncreaseSell', 'priceWeeklyDecreaseSell',
    'priceMonthlyIncreaseSell', 'priceMonthlyDecreaseSell',
    'priceQuarterlyIncreaseSell', 'priceQuarterlyDecreaseSell',
    'priceYearlyIncreaseSell', 'priceYearlyDecreaseSell',
    'epsQuarterlyBeatsSell', 'epsQuarterlyMissSell',
    'profitQuarterlyIncreaseSell', 'profitQuarterlyDecreaseSell',
    'incomeQuarterlyIncreaseSell', 'incomeQuarterlyDecreaseSell',
    'revenueQuarterlyIncreaseSell', 'revenueQuarterlyDecreaseSell',
    'profitYearlyIncreaseSell', 'profitYearlyDecreaseSell',
    'incomeYearlyIncreaseSell', 'incomeYearlyDecreaseSell',
    'revenueYearlyIncreaseSell', 'revenueYearlyDecreaseSell',
    'inflationYearlyIncreaseSell', 'inflationYearlyDecreaseSell',
    'fundsRateMonthlyIncreaseSell', 'fundsRateMonthlyDecreaseSell',
    'thirtyYearsTreasuryMonthlyIncreaseSell', 'thirtyYearsTreasuryMonthlyDecreaseSell',
    'tenYearsTreasuryMonthlyIncreaseSell', 'tenYearsTreasuryMonthlyDecreaseSell',
    'inflationMonthlyIncreaseSell', 'inflationMonthlyDecreaseSell',
    'cpiMonthlyIncreaseSell', 'cpiMonthlyDecreaseSell',
    'consumerSentimentMonthlyIncreaseSell', 'consumerSentimentMonthlyDecreaseSell',
    'retailSalesMonthlyIncreaseSell', 'retailSalesMonthlyDecreaseSell',
    'durableGoodsMonthlyIncreaseSell', 'durableGoodsMonthlyDecreaseSell',
    'unemploymentRateMonthlyIncreaseSell', 'unemploymentRateMonthlyDecreaseSell',
    'nonfarmPayrollMonthlyIncreaseSell', 'nonfarmPayrollMonthlyDecreaseSell',
    'gdpYearlyChangeAboveSell', 'gdpYearlyChangeBelowSell',
    'gdpQuarterlyChangeAboveSell', 'gdpQuarterlyChangeBelowSell',
    'gdpQuarterlyYoYChangeAboveSell', 'gdpQuarterlyYoYChangeBelowSell',
  ]

  const normalBehaviors: interfaces.traderPatternModel.BehaviorType[] = [
    'cashMaxPercent',
    'tickerMinPercent', 'tickerMaxPercent',
    'holdingBuyPercent', 'holdingSellPercent',
    'tradeFrequency', 'rebalanceFrequency',
    'buyPreference', 'sellPreference',
  ]

  const activeBuyBehaviors = buyBehaviors.filter((key) => pattern[key] !== null)
  const activeSellBehaviors = sellBehaviors.filter((key) => pattern[key] !== null)

  return (
    <div className={classNames('row-start', classes.container)}>
      {activeBuyBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          pattern={pattern}
          type={behavior}
          className={classes.label}
          color={themeConstant.theme.INCREASE_COLOR}
        />
      ))}
      {activeSellBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          pattern={pattern}
          type={behavior}
          className={classes.label}
          color={themeConstant.theme.DECREASE_COLOR}
        />
      ))}
      {normalBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          pattern={pattern}
          type={behavior}
          className={classes.label}
          color='grey'
        />
      ))}
    </div>
  )
}

export default PatternBehaviors
