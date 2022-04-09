import { useState } from 'react'
import { Segment, Label, Divider, Button } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import ValueDiffer from '../elements/ValueDiffer'
import HoldingShare from '../elements/HoldingShare'
import useTickerState from '../../../states/useTickerState'

const useStyles = createUseStyles(({
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
  const [showAllHoldings, setShowAllHoldings] = useState(false)
  const orderedHoldings = holding.holdings.sort((prev, curr) => curr.value < prev.value ? -1 : 1)
  const displayedHoldings = showAllHoldings ? orderedHoldings : orderedHoldings.slice(0, 10)

  // ------------------------------------------------------------ Handler --

  const handleClickShowMore = () => {
    setShowAllHoldings(true)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <Segment className={classes.container}>
      <div className='column-start'>
        <div className='row-start'>
          <Label>
            {localeTool.t('common.date')}: {holding.date}
          </Label>
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
        <div className={classNames('row-start', classes.differRow)}>
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
      <Divider />
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
          <Button onClick={handleClickShowMore}>
            {localeTool.t('profile.showAllHoldings')}
          </Button>
        </div>
      )}
    </Segment>
  )
}

export default HoldingCard
