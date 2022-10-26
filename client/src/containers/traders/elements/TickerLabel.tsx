import classNames from 'classnames'
import { Label, SemanticCOLORS } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles(({
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
  color: SemanticCOLORS;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  // ------------------------------------------------------------ Handler --

  const handleClick = () => {
    if (!ticker || !onClick) return
    onClick(ticker.id)
  }

  // ------------------------------------------------------------ UI --

  if (!ticker) return null

  return (
    <Label
      data-testid='tickerLabel'
      color={color}
      className={classNames(classes.label, {
        [commonClasses.cursorClickable]: !!onClick,
      })}
      title={ticker.name}
      onClick={handleClick}
    >
      {ticker.symbol}
    </Label>
  )
}

export default TickerLabel
