import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as vendorTool from '../../../tools/vendor'
import PatternBehaviors from '../elements/PatternBehaviors'
import TraderPerformance, { FocusType } from '../elements/TraderPerformance'
import WatchButton from '../elements/WatchButton'
import TrendChart from '../elements/TrendChart'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import useCommonState from '../../../states/useCommonState'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  pattern: {
    margin: '0 0 2rem 0 !important',
    minWidth: '24rem',
    padding: '0 !important',
  },
  header: {
    width: '100%',
  },
  label: {
    marginRight: '1rem !important',
  },
  body: {
    padding: '1rem',
  },
  active: {
    border: `2px solid ${theme.PRIMARY_COLOR} !important`,
  },
}))

const ProfileCard = ({
  profile,
  focusType,
  isActive,
  onClick,
  simple,
}: {
  profile: interfaces.traderRes.TraderProfile | null;
  focusType?: FocusType;
  isActive?: boolean,
  onClick?: (record: interfaces.traderModel.Record) => void;
  simple?: boolean;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const { createWatchedProfile, deleteWatchedProfile } = useTraderState()
  const { addMessage } = useCommonState()

  const user = getUser()

  const trader = profile?.trader || null
  const pattern = profile?.pattern || null
  const traderEnvId = trader?.traderEnvId || null
  const traderId = trader?.id || null

  const traderEnv = user.userTraderEnvs.find((env) => env.id === traderEnvId) || null
  const isWatched = !!user.userTraderIds && !!traderId && user.userTraderIds.includes(traderId)

  const trendData = trader?.oneYearTrends
    ? trader.oneYearTrends.map((value, index) => ({ label: `${index}`, value }))
    : []

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
    <vendorTool.ui.Segment
      className={vendorTool.classNames('row-around', classes.pattern, {
        'click-cursor': !!onClick,
        [classes.active]: !!isActive,
      })}
      onClick={handleClick}
      padded
    >
      <header
        className={vendorTool.classNames('row-between', classes.header)}
      >
        <div className='row-start'>
          <vendorTool.ui.Label color='blue' className={classes.label}>
            {localeTool.t('common.profile')} #{trader.traderPatternId} - {traderEnv.name}
          </vendorTool.ui.Label>
          <h5>
            {localeTool.t('profile.estimatedAt', { date: trader.estimatedAt })}
          </h5>
        </div>
        {!!user.userTraderIds && !simple && (
          <WatchButton
            isWatched={isWatched}
            onToggle={handleToggleWatch}
          />
        )}
      </header>

      <div className={classes.body}>
        <section className='row-around'>
          <TraderPerformance trader={trader} focusType={focusType} />
          <TrendChart data={trendData} />
        </section>
        {!simple && (
          <PatternBehaviors envId={trader.traderEnvId} pattern={pattern} />
        )}
      </div>
    </vendorTool.ui.Segment>
  )
}

export default ProfileCard
