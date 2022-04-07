import { Segment, Label, Divider } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import ValueDiffer from '../elements/ValueDiffer'
import HoldingShare from '../elements/HoldingShare'
import useTickerState from '../../../states/useTickerState'

const useStyles = createUseStyles(({
  value: {
    marginLeft: '2rem !important',
    marginRight: '1rem !important',
  },
}))

const HoldingCard = ({
  holding,
  previousHolding,
}: {
  holding: interfaces.traderHoldingModel.Detail,
  previousHolding: interfaces.traderHoldingModel.Detail | null,
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getTickerIdentity } = useTickerState()

  // ------------------------------------------------------------ Interface --

  return (
    <Segment>
      <div className='row-start'>
        <Label>
          {localeTool.t('common.date')}: {holding.date}
        </Label>
        {holding.totalValue !== null && (
          <h5 className={classes.value}>
            <b>{localeTool.t('common.totalValue')}:</b>&nbsp;
            {parseTool.holdingValue(holding.totalValue)}
          </h5>
        )}
        {previousHolding && (
          <ValueDiffer
            currentValue={holding.totalValue}
            previousValue={previousHolding.totalValue}
          />
        )}
        {holding.totalCash !== null && (
          <h5>
            <b>{localeTool.t('common.cash')}:</b>&nbsp;
            {parseTool.holdingValue(holding.totalCash)}
          </h5>
        )}
      </div>
      <Divider />
      {holding.holdings.map((tickerHolding) => {
        const identity = getTickerIdentity(tickerHolding.tickerId)
        return (
          <HoldingShare
            key={tickerHolding.tickerId}
            tickerIdentity={identity}
            tickerHolding={tickerHolding}
            previousHoldings={previousHolding?.holdings}
          />
        )
      })}
    </Segment>
  )
}

export default HoldingCard
