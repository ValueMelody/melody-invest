import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { Badge, Card } from 'flowbite-react'
import classNames from 'classnames'

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
  const previousItem = previousDetail?.items.find((previous) => previous.tickerId === holdingItem.tickerId)
  const currentShares = Math.floor(holdingItem.shares * holdingItem.splitMultiplier)
  const previousShares = previousItem ? Math.floor(previousItem.shares * previousItem.splitMultiplier) : null
  const shareDiffer = previousShares ? currentShares - previousShares : null

  return (
    <Card
      data-testid='holdingShare'
      title={tickerIdentity?.name}
      className='text-xs [&>div]:p-2 mx-2 my-1'
    >
      <div className='flex items-center'>
        <h5 data-testid='holdingshareTitle'>
          {tickerIdentity?.symbol}&nbsp;
          {parseTool.floatToPercent(holdingItem.value / totalValue)}&nbsp;
        </h5>
        {!!shareDiffer && (
          <span
            className={classNames('ml-2', {
              'text-green-600': shareDiffer > 0,
              'text-red-600': shareDiffer < 0,
            })}
          >
            {shareDiffer > 0 ? '+' : '-'} {Math.abs(shareDiffer)} {localeTool.t('common.shares')}
          </span>
        )}
        {!!previousDetail && !previousItem && (
          <Badge
            color='success'
            className='ml-2'
          >
            {localeTool.t('common.new')}
          </Badge>
        )}
      </div>
    </Card>
  )
}

export default HoldingShare
