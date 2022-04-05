import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'

const useStyles = createUseStyles(({
  label: {
    alignSelf: 'flex-start',
    marginBottom: '0.5rem !important',
  },
}))

const TickerLabel = ({
  ticker,
  onClick,
}: {
  ticker: interfaces.tickerModel.Identity | null;
  onClick?: (tickerId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClick = () => {
    if (!ticker || !onClick) return
    onClick(ticker.id)
  }

  // ------------------------------------------------------------ Interface --

  if (!ticker) return null

  return (
    <Label
      color='blue'
      className={classNames(classes.label, {
        'click-cursor': !!onClick,
      })}
      title={ticker.name}
      onClick={handleClick}
    >
      {ticker.symbol}
    </Label>
  )
}

export default TickerLabel
