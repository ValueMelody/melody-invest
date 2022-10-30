import classNames from 'classnames'
import { Card, Alert } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import useUserState from 'states/useUserState'
import useTraderState from 'states/useTraderState'
import useCommonState from 'states/useCommonState'
import useTraderRequest from 'requests/useTraderRequest'
import PatternBehaviors from 'containers/traders/elements/PatternBehaviors'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import WatchButton from 'containers/traders/elements/WatchButton'
import ProfileLabel from 'containers/traders/elements/ProfileLabel'

const TraderProfileCard = ({
  profile,
  isActive = false,
  simple = false,
  disabled = false,
  disabledUnwatch = false,
  className,
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
      className={classNames(className, {
        'cursor-pointer': isClickable,
        'card-disabled': disabled,
        'card-active': !!isActive,
      })}
      onClick={isClickable ? handleClick : undefined}
    >
      <header
        className='flex flex-wrap items-center justify-between w-full'
      >
        <section className='flex flex-wrap'>
          <ProfileLabel
            color='info'
            className='mr-4'
            trader={trader}
            traderEnv={traderEnv.record}
          />
          <h5>
            {localeTool.t('profile.estimatedAt', { date: trader.estimatedAt })}
          </h5>
        </section>
        {!!user.userType && !simple && showToggle && (
          <WatchButton
            isWatched={isWatched}
            onToggle={handleToggleWatch}
          />
        )}
      </header>

      {disabled && (
        <Alert color='warning'>
          {localeTool.t('permission.limited')}
        </Alert>
      )}

      {!disabled && (
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
      )}

      {!simple && !disabled && (
        <PatternBehaviors
          envId={trader.traderEnvId}
          pattern={pattern}
        />
      )}
    </Card>
  )
}

export default TraderProfileCard
