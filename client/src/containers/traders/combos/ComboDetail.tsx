import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import PageTitle from 'containers/elements/PageTitle'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import { contentSlice } from 'stores/content'
import { useEffect } from 'react'
import usePrivateGuard from 'hooks/usePrivateGuard'
import useShowMore from 'hooks/useShowMore'

const ComboDetail = () => {
  usePrivateGuard()

  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const navigate = useNavigate()

  const { activeTraderChartIndex: activeChartIndex } = useSelector(selectors.selectContent())

  const { displayedTotal, renderShowMoreButton } = useShowMore()

  const traderEnvDict = useSelector(selectors.selectTraderEnvBaseDict())
  const traderProfileDict = useSelector(selectors.selectTraderProfileBaseDict())

  const comboId = params.comboId ? parseInt(params.comboId) : undefined
  const matchedBase = useSelector(selectors.selectTraderComboBaseById(comboId))
  const matchedDetail = useSelector(selectors.selectTraderComboDetailById(comboId))

  const holdings = matchedDetail?.holdings || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  const profilesWithEnvs = matchedBase?.traderIds.map((traderId) => {
    const profile = traderProfileDict[traderId]
    const env = profile?.trader.traderEnvId
      ? traderEnvDict[profile.trader.traderEnvId]
      : undefined
    return { profile, env }
  }) || []

  useEffect(() => {
    if (!matchedBase?.id || matchedDetail) return
    dispatch(actions.fetchTraderComboDetail(matchedBase.id))
  }, [matchedBase?.id, matchedDetail, dispatch])

  useEffect(() => {
    if (!comboId) navigate(routerTool.notFoundRoute())
  }, [comboId, navigate])

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleChangeChartIndex = (index: number) => {
    dispatch(contentSlice.actions.changeActiveTraderChartIndex(index))
  }

  if (!matchedBase || !matchedDetail) return null

  return (
    <section
      data-testid='comboDetail'
      className='detail-root'
    >
      <header className='detail-header'>
        <TraderComboCard
          className='w-80'
          traderCombo={matchedBase}
        />
      </header>
      <section className='page-root'>
        <section className='page-main'>
          <PageTitle
            icon='performance'
            title={localeTool.t('traderCombo.pastPerformance')}
          />
          <ValueChangePanel
            yearlyPercentNumber={matchedDetail.yearlyPercentNumber}
            pastYearPercentNumber={matchedDetail.pastYearPercentNumber}
            pastQuarterPercentNumber={matchedDetail.pastQuarterPercentNumber}
            pastMonthPercentNumber={matchedDetail.pastMonthPercentNumber}
            pastWeekPercentNumber={matchedDetail.pastWeekPercentNumber}
            oneDecadeTrends={matchedDetail.oneDecadeTrends}
            oneYearTrends={matchedDetail.oneYearTrends}
            totalValue={matchedDetail.totalValue}
            activeChartIndex={activeChartIndex}
            onChangeChart={handleChangeChartIndex}
            showPercents
            showCharts
          />
          <PageTitle
            icon='history'
            className='my-8'
            title={localeTool.t('traderCombo.history')}
          />
          {!displayedHoldings.length && (
            <Alert
              color='warning'
              className='mt-4'
            >
              {localeTool.t('traderCombo.noResultYet')}
            </Alert>
          )}
          {displayedHoldings.map((detail, index) => (
            <HoldingCard
              key={detail.date}
              className='mb-6'
              holding={detail}
              previousHolding={index < holdings.length - 1 ? holdings[index + 1] : null}
              initialValue={constants.Trader.Initial.Cash * matchedBase.traderIds.length}
            />
          ))}
          {displayedTotal < holdings.length && renderShowMoreButton()}
        </section>
        <aside className='page-aside'>
          <PageTitle
            title={localeTool.t('traderCombo.includedProfiles')}
            className='mb-4'
          />
          <section className='mb-4'>
            {profilesWithEnvs.map((profileWithEnv, index) => (
              <ProfileValue
                key={profileWithEnv.profile?.trader.id || `profile-${index}`}
                className='mb-4'
                trader={profileWithEnv.profile?.trader || null}
                env={profileWithEnv.env || null}
                onClick={handleClickProfile}
              />
            ))}
          </section>
          <PageTitle
            icon='pie'
            title={localeTool.t('traderCombo.profilePortion')}
          />
          <ComboProfiles
            profilesWithEnvs={profilesWithEnvs}
            onClickProfile={handleClickProfile}
          />
        </aside>
      </section>
    </section>
  )
}

export default ComboDetail
