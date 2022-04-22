import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import PatternBehaviors from '../elements/PatternBehaviors'
import TraderPerformance, { FocusType } from '../elements/TraderPerformance'
import WatchButton from '../elements/WatchButton'
import TrendChart from '../elements/TrendChart'
import ProfileLabel from '../elements/ProfileLabel'
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
  body: {
    padding: '1rem',
  },
  active: {
    border: `2px solid ${theme.PrimaryColor} !important`,
  },
  label: {
    alignSelf: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
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

  const trendData = trader
    ? parseTool.chartTrends(trader.oneYearTrends, trader.totalValue)
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

  // ------------------------------------------------------------ UI --

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
        <div className={vendorTool.classNames('row-start', classes.label)}>
          <ProfileLabel
            color='blue'
            trader={trader}
            traderEnv={traderEnv}
          />
          <h5 className={classes.desc}>
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
          {!simple && (
            <TrendChart
              data={trendData}
              title={`${localeTool.t('common.daysTrends', { num: 30 * (trendData.length - 1) })}`}
            />
          )}
        </section>
        {!simple && (
          <PatternBehaviors envId={trader.traderEnvId} pattern={pattern} />
        )}
      </div>
    </vendorTool.ui.Segment>
  )
}

export default ProfileCard
