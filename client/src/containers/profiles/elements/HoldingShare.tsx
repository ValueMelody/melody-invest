import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import useTickerState from '../../../states/useTickerState'
import * as localeTool from '../../../tools/locale'
import * as themeEnum from '../../../enums/theme'
import classNames from 'classnames'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  ticker: {
    margin: '0.5rem !important',
  },
  differ: {
    marginLeft: '0.5rem',
  },
  increaseColor: {
    color: theme.INCREASE_COLOR,
  },
  decreaseColor: {
    color: theme.DECREASE_COLOR,
  },
}))

const HoldingShare = ({
  tickerHolding,
  previousHoldings,
}: {
  tickerHolding: interfaces.traderHoldingModel.Holding;
  previousHoldings?: interfaces.traderHoldingModel.Holding[];
}) => {
  const classes = useStyles()
  const { tickerIdentities } = useTickerState()
  const identities = tickerIdentities || {}
  const identity = identities[tickerHolding.tickerId]
  const previousHolding = previousHoldings?.find((previous) => previous.tickerId === tickerHolding.tickerId)
  const currentShares = Math.floor(tickerHolding.shares * tickerHolding.splitMultiplier)
  const previousShares = previousHolding ? Math.floor(previousHolding.shares * previousHolding.splitMultiplier) : null
  const shareDiffer = previousShares ? (currentShares - previousShares) / tickerHolding.splitMultiplier : null

  return (
    <Label
      basic
      key={tickerHolding.tickerId}
      title={identity?.name}
      className={classes.ticker}
    >
      {identity?.symbol}: {currentShares} {localeTool.t('common.shares')}
      {!!shareDiffer && (
        <span
          className={classNames(classes.differ, {
            [classes.increaseColor]: shareDiffer > 0,
            [classes.decreaseColor]: shareDiffer < 0,
          })}
        >
          {shareDiffer > 0 ? '+' : '-'} {Math.abs(Number(shareDiffer.toFixed(0)))}
        </span>
      )}
    </Label>
  )
}

export default HoldingShare
