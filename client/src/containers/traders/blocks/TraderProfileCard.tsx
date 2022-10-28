import classNames from 'classnames'
import { Card } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import { createUseStyles } from 'react-jss'
import useUserState from 'states/useUserState'
import useTraderState from 'states/useTraderState'
import useCommonState from 'states/useCommonState'
import useTraderRequest from 'requests/useTraderRequest'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import PatternBehaviors from 'containers/traders/elements/PatternBehaviors'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import WatchButton from 'containers/traders/elements/WatchButton'
import ProfileLabel from 'containers/traders/elements/ProfileLabel'

const useStyles = createUseStyles({
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
  label: {
    alignSelf: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
  },
})

const TraderProfileCard = ({
  profile,
  isActive = false,
  simple = false,
  disabled = false,
  disabledUnwatch = false,
  onClick,
}: {
  profile: interfaces.response.TraderProfile | null;
  isActive?: boolean,
  simple?: boolean;
  className?: string;
  disabled?: boolean;
  disabledUnwatch?: boolean;
  onClick?: (record: interfaces.traderModel.Record) => void;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

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

  const isWatched = !!user.userType && !!traderId && user.userTraderIds.includes(traderId)
  const showToggle = !isWatched || !disabledUnwatch

  const isClickable = !!onClick && !disabled

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
        type: 'failure',
      })
      return
    }
    if (!user.canFollowTrader && !isWatched) {
      addMessage({
        id: Math.random(),
        title: localeTool.t('permission.limited'),
        type: 'failure',
      })
      return
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
    <Card
      data-testid='traderProfileCard'
      className={classNames(commonClasses.rowAround, classes.pattern, {
        [commonClasses.cursorClickable]: isClickable,
        [cardClasses.disabled]: disabled,
        [cardClasses.isActive]: !!isActive,
      })}
      onClick={isClickable ? handleClick : undefined}
    >
      <header
        className='flex flex-wrap items-center justify-between w-full'
      >
        <div className={classNames(
          commonClasses.rowStart,
          classes.label,
        )}>
          <ProfileLabel
            color='info'
            trader={trader}
            traderEnv={traderEnv.record}
          />
          <h5 className={classes.desc}>
            {localeTool.t('profile.estimatedAt', { date: trader.estimatedAt })}
          </h5>
        </div>
        {!!user.userType && !simple && showToggle && (
          <WatchButton
            isWatched={isWatched}
            onToggle={handleToggleWatch}
          />
        )}
      </header>

      <div className={classes.body}>
        {disabled && (
          <h4>
            {localeTool.t('permission.limited')}
          </h4>
        )}

        {!disabled && (
          <section className={commonClasses.rowAround}>
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
        )}

        {!simple && !disabled && (
          <PatternBehaviors envId={trader.traderEnvId} pattern={pattern} />
        )}
      </div>
    </Card>
  )
}

export default TraderProfileCard
