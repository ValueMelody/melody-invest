import classNames from 'classnames'
import { Badge } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'

const TickerLabel = ({
  ticker,
  onClick,
  color,
}: {
  ticker: interfaces.tickerModel.Identity | null;
  onClick?: (tickerId: number) => void;
  color: 'info' | 'gray';
}) => {
  // ------------------------------------------------------------ Handler --

  const handleClick = () => {
    if (!ticker || !onClick) return
    onClick(ticker.id)
  }

  // ------------------------------------------------------------ UI --

  if (!ticker) return null

  return (
    <Badge
      size='sm'
      data-testid='tickerLabel'
      color={color}
      className={classNames('mx-2 my-1', {
        'cursor-pointer': !!onClick,
      })}
      title={ticker.name}
      onClick={handleClick}
    >
      {ticker.symbol}
    </Badge>
  )
}

export default TickerLabel
