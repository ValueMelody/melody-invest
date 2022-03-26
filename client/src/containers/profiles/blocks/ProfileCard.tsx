import { Segment } from 'semantic-ui-react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import PatternBehaviors from '../elements/PatternBehaviors'
import TraderPerformance, { FocusType } from '../elements/TraderPerformance'
import WatchButton from '../elements/WatchButton'
import PatternLabel from '../elements/PatternLabel'
import useToggleWatch from '../hooks/useToggleWatch'
import useUser from '../../../states/useUser'
import useTraderEnv from '../../../states/useTraderEnv'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  pattern: {
    margin: '0 1rem 1rem 1rem !important',
    width: '28rem',
    padding: '0 !important',
  },
  header: {
    width: '100%',
  },
  body: {
    padding: '1rem',
  },
}))

const ProfileCard = ({
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
  const { userTraderIds } = useUser()
  const { getTraderEnv } = useTraderEnv()
  const { isWatched, handleToggleWatch } = useToggleWatch({ traderId: trader.id })

  const traderEnv = getTraderEnv(trader.traderEnvId)!

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
        <PatternLabel patternId={trader.traderPatternId} traderEnv={traderEnv} />
        {!!userTraderIds && (
          <WatchButton
            isWatched={isWatched}
            onToggle={handleToggleWatch}
          />
        )}
      </header>

      <div className={classes.body}>
        <TraderPerformance trader={trader} focusType={focusType} />
        <PatternBehaviors pattern={pattern} />
      </div>
    </Segment>
  )
}

export default ProfileCard
