import { Segment, Label, Button, Icon } from 'semantic-ui-react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../tools/locale'
import * as themeConstant from '../constants/theme'
import PatternBehaviors from './PatternBehaviors'
import TraderPerformance, { FocusType } from './TraderPerformance'

const useStyles = createUseStyles((theme: themeConstant.Theme) => ({
  pattern: {
    width: '32%',
    marginTop: '0 !important',
    marginBottom: '1rem !important',
    minWidth: '28rem',
    padding: '0 !important',
  },
  header: {
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
  },
  body: {
    padding: '1rem',
  },
  action: {
    marginTop: '0.5rem !important',
    marginRight: '0.5rem !important',
    padding: '0.5rem 1rem !important',
  },
}))

const TraderProfileCard = ({
  trader,
  pattern,
  focusType,
  onClick,
}: {
  trader: interfaces.traderModel.Record;
  pattern: interfaces.traderPatternModel.Public;
  focusType?: FocusType;
  onClick?: (record: interfaces.traderModel.Record) => void;
}) => {
  const classes = useStyles()

  const handleClick = () => {
    if (!onClick) return
    return onClick(trader)
  }

  return (
    <Segment
      className={classNames('row-around', classes.pattern, {
        'click-cursor': !!onClick,
      })}
      onClick={handleClick}
      padded
    >
      <header className={classNames('row-between', classes.header)}>
        <Label color='blue' className={classes.label}>
          {localeTool.t('common.pattern')}: #{trader.traderPatternId}
        </Label>
        <Button className={classes.action}>
          <Icon name='eye' />
          {localeTool.t('common.watch')}
        </Button>
      </header>

      <div className={classes.body}>
        <TraderPerformance trader={trader} focusType={focusType} />
        <PatternBehaviors pattern={pattern} />
      </div>
    </Segment>
  )
}

export default TraderProfileCard
