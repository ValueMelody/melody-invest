import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'

const useStyles = createUseStyles(({
  label: {
    alignSelf: 'flex-start',
    marginBottom: '0.5rem !important',
  },
}))

const TickerLabel = ({
  ticker,
}: {
  ticker: interfaces.tickerModel.Identity | null;
}) => {
  const classes = useStyles()

  if (!ticker) return null

  return (
    <Label color='blue' className={classes.label} title={ticker.name}>
      {ticker.symbol}
    </Label>
  )
}

export default TickerLabel
