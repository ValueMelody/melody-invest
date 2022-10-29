import { useState } from 'react'
import { Button, Badge, Card } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useResourceState from 'states/useResourceState'
import useCommonStyle from 'styles/useCommonStyle'
import ValueDiffer from 'containers/traders/elements/ValueDiffer'
import HoldingShare from 'containers/traders/elements/HoldingShare'

const HoldingCard = ({
  holding,
  previousHolding,
  initialValue,
  className,
}: {
  holding: interfaces.traderHoldingModel.Detail;
  previousHolding: interfaces.traderHoldingModel.Detail | null;
  initialValue: number;
  className?: string;
}) => {
  // ------------------------------------------------------------ State --

  const { commonClasses } = useCommonStyle()

  const { getTickerIdentity } = useResourceState()
  const [showAllHoldings, setShowAllHoldings] = useState(false)
  const orderedHoldingItems = holding.items.sort((prev, curr) => curr.value < prev.value ? -1 : 1)
  const displayedHoldingItems = showAllHoldings ? orderedHoldingItems : orderedHoldingItems.slice(0, 10)

  // ------------------------------------------------------------ Handler --

  const handleClickShowMore = () => {
    setShowAllHoldings(true)
  }

  // ------------------------------------------------------------ UI --

  return (
    <Card
      className={className}
    >
      <header className='flex justify-between items-center'>
        <div className={commonClasses.rowStart}>
          <Badge className='mr-4' color='indigo'>
            {localeTool.t('common.date')}: {holding.date}
          </Badge>
          {holding.totalValue !== null && (
            <h5 className='mr-4'>
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
        <div className={commonClasses.rowStart}>
          {previousHolding && (
            <ValueDiffer
              className='mr-4'
              title={localeTool.t('common.sinceLast')}
              currentValue={holding.totalValue}
              compareValue={previousHolding.totalValue}
            />
          )}
          <ValueDiffer
            title={localeTool.t('common.sinceStart')}
            currentValue={holding.totalValue}
            compareValue={initialValue}
          />
        </div>
      </header>
      <div className='border border-gray-200 my-4' />
      <section className='flex flex-wrap'>
        {displayedHoldingItems.map((holdingItem) => {
          const identity = getTickerIdentity(holdingItem.tickerId)
          return (
            <HoldingShare
              key={holdingItem.tickerId}
              tickerIdentity={identity}
              totalValue={holding.totalValue}
              holdingItem={holdingItem}
              previousDetail={previousHolding}
            />
          )
        })}
      </section>
      {!showAllHoldings && orderedHoldingItems.length > 10 && (
        <div className={commonClasses.rowAround}>
          <Button color='gray' onClick={handleClickShowMore}>
            {localeTool.t('profile.showAllHoldings')}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default HoldingCard
