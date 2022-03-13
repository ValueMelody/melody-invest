import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import useTickerProfile from '../../../states/useTickerProfile'
import * as localeTool from '../../../tools/locale'
import classNames from 'classnames'

const useStyles = createUseStyles(({
  ticker: {
    margin: '0.5rem !important',
  },
  differ: {
    marginLeft: '0.5rem',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
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
  const { tickerIdentities } = useTickerProfile()
  const identities = tickerIdentities || {}
  const identity = identities[tickerHolding.tickerId]
  const previousHolding = previousHoldings?.find((previous) => previous.tickerId === tickerHolding.tickerId)
  const shareDiffer = previousHolding ? tickerHolding.shares - previousHolding.shares : null

  return (
    <Label
      basic
      key={tickerHolding.tickerId}
      title={identity?.name}
      className={classes.ticker}
    >
      {identity?.symbol}: {tickerHolding.shares} {localeTool.t('common.shares')}
      {!!shareDiffer && (
        <span
          className={classNames(classes.differ, {
            [classes.green]: shareDiffer > 0,
            [classes.red]: shareDiffer < 0,
          })}
        >
          {shareDiffer > 0 ? '+' : '-'} {Math.abs(shareDiffer)}
        </span>
      )}
    </Label>
  )
}

export default HoldingShare
