import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import { BehaviorLabel } from '../../../components'

const useStyles = createUseStyles({
  container: {
    marginTop: '1rem',
  },
  label: {
    marginBottom: '0.5rem !important',
  },
})

const PatternBehaviors = ({
  pattern,
}: {
  pattern: interfaces.traderPatternModel.Record;
}) => {
  const classes = useStyles()

  const behaviors: interfaces.traderPatternModel.BehaviorType[] = [
    'cashMaxPercent',
    'tickerMinPercent', 'tickerMaxPercent',
    'holdingBuyPercent', 'holdingSellPercent',
    'tradeFrequency', 'rebalanceFrequency',
    'buyPreference', 'sellPreference',
  ]

  return (
    <div className={classNames('row-start', classes.container)}>
      {behaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          pattern={pattern}
          type={behavior}
          className={classes.label}
          color='grey'
        />
      ))}
    </div>
  )
}

export default PatternBehaviors
