import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Alert, Button, Card } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { CodeBracketIcon } from '@heroicons/react/24/solid'
import PatternBehaviors from 'containers/traders/elements/PatternBehaviors'
import ProfileLabel from 'containers/traders/elements/ProfileLabel'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import WatchButton from 'containers/traders/elements/WatchButton'
import classNames from 'classnames'
import { contentSlice } from 'stores/content'
import { globalSlice } from 'stores/global'
import { useNavigate } from 'react-router-dom'

const TraderProfileCard = ({
  profile,
  isActive = false,
  simple = false,
  disabled = false,
  disabledUnwatch = false,
  className,
  onClick,
}: {
  profile?: interfaces.response.TraderProfile | null; // TODO: remove null here
  isActive?: boolean,
  simple?: boolean;
  className?: string;
  disabled?: boolean;
  disabledUnwatch?: boolean;
  onClick?: (record: interfaces.traderModel.Record) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const user = useSelector(selectors.selectUser())

  const { activeTraderChartIndex: activeChartIndex } = useSelector(selectors.selectContent())

  const trader = profile?.trader || null
  const pattern = profile?.pattern || null
  const traderEnvId = trader?.traderEnvId
  const traderId = trader?.id || null

  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(traderEnvId))

  const isWatched = !!user.userType && !!traderId && user.userTraderIds.includes(traderId)
  const showToggle = !isWatched || !disabledUnwatch

  const isClickable = !!onClick && !disabled

  const handleClick = () => {
    if (!onClick || !trader) return
    return onClick(trader)
  }

  const handleToggleWatch = () => {
    if (!trader) return
    if (!user.userType) {
      dispatch(globalSlice.actions.addMessage({
        title: localeTool.t('error.guest'),
        type: 'failure',
      }))
      return
    }
    if (!user.access.canFollowTrader && !isWatched) {
      dispatch(globalSlice.actions.addMessage({
        title: localeTool.t('permission.limited'),
        type: 'failure',
      }))
      return
    }
    if (isWatched) {
      dispatch(actions.deleteWatchedProfile(trader.id))
    } else {
      dispatch(actions.createWatchedProfile(trader.id))
    }
  }

  const handleFork = () => {
    navigate(routerTool.profileBuildRoute(), {
      state: pattern,
    })
  }

  const handleChangeChartIndex = (index: number) => {
    dispatch(contentSlice.actions.changeActiveTraderChartIndex(index))
  }

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
            traderEnv={traderEnv}
          />
          <h5>
            {localeTool.t('profile.estimatedAt', { date: trader.estimatedAt })}
          </h5>
        </section>
        {!!user.userType && !simple && showToggle && (
          <section className='flex flex-start'>
            <WatchButton
              isWatched={isWatched}
              onToggle={handleToggleWatch}
            />
            <Button
              size='xs'
              className='ml-4'
              onClick={handleFork}
              disabled={!user.access.canFollowTrader}
              title={
                user.access.canFollowTrader
                  ? localeTool.t('profileBuilder.fork')
                  : localeTool.t('permission.limited')
              }
            >
              <CodeBracketIcon className='icon-size mr-2' />
              {localeTool.t('common.fork')}
            </Button>
          </section>
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
