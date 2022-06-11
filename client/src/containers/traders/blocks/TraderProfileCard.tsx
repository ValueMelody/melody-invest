import * as interfaces from '@shared/interfaces'
import * as localeTool from '../../../tools/locale'
import * as vendorTool from '../../../tools/vendor'
import PatternBehaviors from '../elements/PatternBehaviors'
import ValueChangePanel from '../elements/ValueChangePanel'
import WatchButton from '../elements/WatchButton'
import ProfileLabel from '../elements/ProfileLabel'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import useCommonState from '../../../states/useCommonState'
import useTraderRequest from '../../../requests/useTraderRequest'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
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

const TraderProfileCard = ({
  profile,
  isActive,
  onClick,
  simple,
}: {
  profile: interfaces.response.TraderProfile | null;
  isActive?: boolean,
  onClick?: (record: interfaces.traderModel.Record) => void;
  simple?: boolean;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()

  const { getTraderEnv } = useTraderState()
  const { createWatchedProfile, deleteWatchedProfile } = useTraderRequest()

  const { addMessage, getActiveChartIndex, setActiveChartIndex } = useCommonState()
  const activeChartIndex = getActiveChartIndex()

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

  const handleChangeChartIndex = (index: number) => {
    setActiveChartIndex(index)
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
            traderEnv={traderEnv.record}
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
          <ValueChangePanel
            yearlyPercentNumber={trader.yearlyPercentNumber}
            pastYearPercentNumber={trader.pastYearPercentNumber}
            pastQuarterPercentNumber={trader.pastQuarterPercentNumber}
            pastMonthPercentNumber={trader.pastMonthPercentNumber}
            pastWeekPercentNumber={trader.pastWeekPercentNumber}
            oneDecadeTrends={trader.oneDecadeTrends}
            oneYearTrends={trader.oneYearTrends}
            totalValue={trader.totalValue}
            activeChartIndex={activeChartIndex}
            onChangeChart={handleChangeChartIndex}
            showCharts={!simple}
            showPercents
          />
        </section>
        {!simple && (
          <PatternBehaviors envId={trader.traderEnvId} pattern={pattern} />
        )}
      </div>
    </vendorTool.ui.Segment>
  )
}

export default TraderProfileCard
