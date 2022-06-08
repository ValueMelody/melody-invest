import * as vendorTool from '../../../tools/vendor'
import * as interfaces from '@shared/interfaces'

const useStyles = vendorTool.jss.createUseStyles(({
  label: {
    alignSelf: 'flex-start',
    margin: '0.25rem 0.125rem !important',
  },
}))

const TickerLabel = ({
  ticker,
  onClick,
  color,
}: {
  ticker: interfaces.tickerModel.Identity | null;
  onClick?: (tickerId: number) => void;
  color: vendorTool.ui.SemanticCOLORS;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClick = () => {
    if (!ticker || !onClick) return
    onClick(ticker.id)
  }

  // ------------------------------------------------------------ UI --

  if (!ticker) return null

  return (
    <vendorTool.ui.Label
      data-testid='tickerLabel'
      color={color}
      className={vendorTool.classNames(classes.label, {
        'click-cursor': !!onClick,
      })}
      title={ticker.name}
      onClick={handleClick}
    >
      {ticker.symbol}
    </vendorTool.ui.Label>
  )
}

export default TickerLabel
