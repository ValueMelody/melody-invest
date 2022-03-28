import { Segment } from 'semantic-ui-react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import PatternBehaviors from '../elements/PatternBehaviors'
import TraderPerformance, { FocusType } from '../elements/TraderPerformance'
import WatchButton from '../elements/WatchButton'
import PatternLabel from '../elements/PatternLabel'
import useWatchInterface from '../hooks/useWatchInterface'
import useUserState from '../../../states/useUserState'
import useTraderEnvState from '../../../states/useTraderEnvState'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  pattern: {
    margin: '0 0 2rem 0 !important',
    width: '100%',
    padding: '0 !important',
  },
  header: {
    width: '100%',
  },
  body: {
    padding: '1rem',
  },
}))

const ProfileRow = ({
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
  const { userTraderIds } = useUserState()
  const { getTraderEnv } = useTraderEnvState()
  const { isWatched, handleToggleWatch } = useWatchInterface({ traderId: trader.id })

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

export default ProfileRow
