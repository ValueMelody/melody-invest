import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import { Badge } from 'flowbite-react'
import classNames from 'classnames'

const TickerLabel = ({
  ticker,
  onClick,
  color,
  className,
}: {
  ticker: interfaces.tickerModel.Record | null;
  onClick?: (tickerId: number) => void;
  color: 'info' | 'gray';
  className?: string;
}) => {
  const handleClick = () => {
    if (!ticker || !onClick) return
    onClick(ticker.id)
  }

  if (!ticker) return null

  return (
    <Badge
      size='sm'
      data-testid='tickerLabel'
      color={color}
      className={classNames(className, {
        'cursor-pointer': !!onClick,
      })}
      title={localeTool.getTickerName(ticker.symbol)}
      onClick={handleClick}
    >
      {ticker.symbol}
    </Badge>
  )
}

export default TickerLabel
