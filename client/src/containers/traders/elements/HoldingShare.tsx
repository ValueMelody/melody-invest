import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  ticker: {
    margin: '0.5rem !important',
  },
  differ: {
    marginLeft: '0.5rem',
  },
  increaseColor: {
    color: theme.IncreaseColor,
  },
  decreaseColor: {
    color: theme.DecreaseColor,
  },
}))

const HoldingShare = ({
  tickerHolding,
  tickerIdentity,
  previousDetail,
  totalValue,
}: {
  tickerHolding: interfaces.traderHoldingModel.Holding;
  tickerIdentity: interfaces.tickerModel.Identity | null;
  previousDetail: interfaces.traderHoldingModel.Detail | null;
  totalValue: number;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const previousHolding = previousDetail?.holdings.find((previous) => previous.tickerId === tickerHolding.tickerId)
  const currentShares = Math.floor(tickerHolding.shares * tickerHolding.splitMultiplier)
  const previousShares = previousHolding ? Math.floor(previousHolding.shares * previousHolding.splitMultiplier) : null
  const shareDiffer = previousShares ? currentShares - previousShares : null

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.ui.Label
      basic
      key={tickerHolding.tickerId}
      title={tickerIdentity?.name}
      className={classes.ticker}
    >
      {tickerIdentity?.symbol}&nbsp;
      {parseTool.floatToPercent(tickerHolding.value / totalValue)}&nbsp;
      {!!shareDiffer && (
        <span
          className={vendorTool.classNames(classes.differ, {
            [classes.increaseColor]: shareDiffer > 0,
            [classes.decreaseColor]: shareDiffer < 0,
          })}
        >
          {shareDiffer > 0 ? '+' : '-'} {Math.abs(shareDiffer)} {localeTool.t('common.shares')}
        </span>
      )}
      {!!previousDetail && !previousHolding && (
        <span
          className={vendorTool.classNames(classes.differ, classes.increaseColor)}
        >
          {localeTool.t('common.new')}
        </span>
      )}
    </vendorTool.ui.Label>
  )
}

export default HoldingShare
