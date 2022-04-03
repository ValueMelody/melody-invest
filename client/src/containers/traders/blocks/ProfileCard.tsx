import { Segment } from 'semantic-ui-react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import PatternBehaviors from '../elements/PatternBehaviors'
import TraderPerformance, { FocusType } from '../elements/TraderPerformance'
import WatchButton from '../elements/WatchButton'
import PatternLabel from '../elements/PatternLabel'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import useCommonState from '../../../states/useCommonState'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  pattern: {
    margin: '0 0 2rem 0 !important',
    minWidth: '28rem',
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
  profile,
  focusType,
  onClick,
}: {
  profile: interfaces.traderRes.TraderProfile | null;
  focusType?: FocusType;
  onClick?: (record: interfaces.traderModel.Record) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const { getTraderEnv, createWatchedProfile, deleteWatchedProfile } = useTraderState()
  const { addMessage } = useCommonState()

  const user = getUser()

  const trader = profile?.trader || null
  const pattern = profile?.pattern || null
  const traderEnvId = trader?.traderEnvId || null
  const traderId = trader?.id || null

  const traderEnv = getTraderEnv(traderEnvId)
  const isWatched = !!user.userTraderIds && !!traderId && user.userTraderIds.includes(traderId)

  // ------------------------------------------------------------ Handler --

  const handleClick = () => {
    if (!onClick || !trader) return
    return onClick(trader)
  }

  const handleToggleWatch = () => {
    if (!trader) return
    if (!user.userType) {
      addMessage({
        id: Math.random(),
        title: localeTool.t('error.guest'),
        type: 'error',
      })
    }
    if (isWatched) {
      deleteWatchedProfile(trader.id)
    } else {
      createWatchedProfile(trader.id)
    }
  }

  // ------------------------------------------------------------ Interface --

  if (!trader || !pattern || !traderEnv) return null

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
        {!!user.userTraderIds && (
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