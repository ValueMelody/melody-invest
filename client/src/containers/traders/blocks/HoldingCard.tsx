import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import ValueDiffer from '../elements/ValueDiffer'
import HoldingShare from '../elements/HoldingShare'
import useTickerState from '../../../states/useTickerState'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    minWidth: '28rem',
  },
  differRow: {
    marginTop: '1rem',
  },
  totalValue: {
    marginLeft: '2rem !important',
    marginRight: '1rem !important',
  },
}))

const HoldingCard = ({
  holding,
  previousHolding,
  initialValue,
}: {
  holding: interfaces.traderHoldingModel.Detail,
  previousHolding: interfaces.traderHoldingModel.Detail | null,
  initialValue: number,
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getTickerIdentity } = useTickerState()
  const [showAllHoldings, setShowAllHoldings] = vendorTool.react.useState(false)
  const orderedHoldings = holding.holdings.sort((prev, curr) => curr.value < prev.value ? -1 : 1)
  const displayedHoldings = showAllHoldings ? orderedHoldings : orderedHoldings.slice(0, 10)

  // ------------------------------------------------------------ Handler --

  const handleClickShowMore = () => {
    setShowAllHoldings(true)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <vendorTool.ui.Segment className={classes.container}>
      <div className='column-start'>
        <div className='row-start'>
          <vendorTool.ui.Label>
            {localeTool.t('common.date')}: {holding.date}
          </vendorTool.ui.Label>
          {holding.totalValue !== null && (
            <h5 className={classes.totalValue}>
              <b>{localeTool.t('common.totalValue')}:</b>&nbsp;
              {parseTool.holdingValue(holding.totalValue)}
            </h5>
          )}
          {holding.totalCash !== null && (
            <h5>
              <b>{localeTool.t('common.cash')}:</b>&nbsp;
              {parseTool.holdingValue(holding.totalCash)}
            </h5>
          )}
        </div>
        <div className={vendorTool.classNames('row-start', classes.differRow)}>
          {previousHolding && (
            <ValueDiffer
              title={localeTool.t('holdingCard.sinceLast')}
              currentValue={holding.totalValue}
              compareValue={previousHolding.totalValue}
            />
          )}
          <ValueDiffer
              title={localeTool.t('holdingCard.sinceStart')}
              currentValue={holding.totalValue}
              compareValue={initialValue}
            />
        </div>
      </div>
      <vendorTool.ui.Divider />
      {displayedHoldings.map((tickerHolding) => {
        const identity = getTickerIdentity(tickerHolding.tickerId)
        return (
          <HoldingShare
            key={tickerHolding.tickerId}
            tickerIdentity={identity}
            totalValue={holding.totalValue}
            tickerHolding={tickerHolding}
            previousDetail={previousHolding}
          />
        )
      })}
      {!showAllHoldings && orderedHoldings.length > 10 && (
        <div className='row-around'>
          <vendorTool.ui.Button onClick={handleClickShowMore}>
            {localeTool.t('profile.showAllHoldings')}
          </vendorTool.ui.Button>
        </div>
      )}
    </vendorTool.ui.Segment>
  )
}

export default HoldingCard
