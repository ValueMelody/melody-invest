import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
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
  holdingItem,
  tickerIdentity,
  previousDetail,
  totalValue,
}: {
  holdingItem: interfaces.traderHoldingModel.Item;
  tickerIdentity: interfaces.tickerModel.Identity | null;
  previousDetail: interfaces.traderHoldingModel.Detail | null;
  totalValue: number;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const previousItem = previousDetail?.items.find((previous) => previous.tickerId === holdingItem.tickerId)
  const currentShares = Math.floor(holdingItem.shares * holdingItem.splitMultiplier)
  const previousShares = previousItem ? Math.floor(previousItem.shares * previousItem.splitMultiplier) : null
  const shareDiffer = previousShares ? currentShares - previousShares : null

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.ui.Label
      basic
      key={holdingItem.tickerId}
      title={tickerIdentity?.name}
      className={classes.ticker}
    >
      {tickerIdentity?.symbol}&nbsp;
      {parseTool.floatToPercent(holdingItem.value / totalValue)}&nbsp;
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
      {!!previousDetail && !previousItem && (
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
