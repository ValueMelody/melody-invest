import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as selectors from 'selectors'
import { Badge, Button, Card } from 'flowbite-react'
import HoldingShare from 'containers/traders/elements/HoldingShare'
import ValueDiffer from 'containers/traders/elements/ValueDiffer'
import { useSelector } from 'react-redux'
import { useState } from 'react'

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
  const [showAllHoldings, setShowAllHoldings] = useState(false)
  const orderedHoldingItems = [...holding.items].sort((prev, curr) => curr.value < prev.value ? -1 : 1)
  const displayedHoldingItems = showAllHoldings ? orderedHoldingItems : orderedHoldingItems.slice(0, 10)
  const tickerIdentityBaseDict = useSelector(selectors.selectTickerIdentityBaseDict())

  const handleClickShowMore = () => {
    setShowAllHoldings(true)
  }

  return (
    <Card
      className={className}
    >
      <header className='flex flex-wrap justify-between items-center'>
        <section className='flex flex-wrap items-center'>
          <Badge
            className='mr-4 mb-2'
            color='indigo'
          >
            {localeTool.t('common.date')}: {holding.date}
          </Badge>
          {holding.totalValue !== null && (
            <h5 className='mr-4 mb-2'>
              <b>{localeTool.t('common.totalValue')}:</b>&nbsp;
              {parseTool.holdingValue(holding.totalValue)}
            </h5>
          )}
          {holding.totalCash !== null && (
            <h5 className='mb-2'>
              <b>{localeTool.t('common.cash')}:</b>&nbsp;
              {parseTool.holdingValue(holding.totalCash)}
            </h5>
          )}
        </section>
        <section className='flex flex-wrap items-center'>
          {previousHolding && (
            <ValueDiffer
              className='mr-4 mb-2'
              title={localeTool.t('common.sinceLast')}
              currentValue={holding.totalValue}
              compareValue={previousHolding.totalValue}
            />
          )}
          <ValueDiffer
            className='mb-2'
            title={localeTool.t('common.sinceStart')}
            currentValue={holding.totalValue}
            compareValue={initialValue}
          />
        </section>
      </header>
      <div className='border border-gray-200 mb-2' />
      <section className='flex flex-wrap'>
        {displayedHoldingItems.map((holdingItem) => {
          return (
            <HoldingShare
              key={holdingItem.tickerId}
              tickerIdentity={tickerIdentityBaseDict[holdingItem.tickerId]}
              totalValue={holding.totalValue}
              holdingItem={holdingItem}
              previousDetail={previousHolding}
            />
          )
        })}
      </section>
      {!showAllHoldings && orderedHoldingItems.length > 10 && (
        <div className='flex justify-center'>
          <Button
            color='gray'
            onClick={handleClickShowMore}
          >
            {localeTool.t('profile.showAllHoldings')}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default HoldingCard
