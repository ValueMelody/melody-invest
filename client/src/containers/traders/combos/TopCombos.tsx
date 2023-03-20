import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import DisclaimerModal from 'containers/traders/elements/DisclaimerModal'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import PageTitle from 'containers/elements/PageTitle'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import { contentSlice } from 'stores/content'
import { useNavigate } from 'react-router-dom'

const TopCombos = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [focusedComboId, setFocusedComboId] = useState(-1)

  const { activeTraderChartIndex: activeChartIndex } = useSelector(selectors.selectContent())

  const traderEnvDict = useSelector(selectors.selectTraderEnvBaseDict())
  const traderCombos = useSelector(selectors.selectTraderComboBases())
  const traderProfileDict = useSelector(selectors.selectTraderProfileBaseDict())

  const systemCombos = traderCombos.filter((combo) => combo.isSystem)
  const comboBase = systemCombos.find((combo) => combo.id === focusedComboId) || null
  const comboDetail = useSelector(selectors.selectTraderComboDetailById(focusedComboId))

  const profilesWithEnvs = comboBase?.traderIds.map((traderId) => {
    const profile = traderProfileDict[traderId]
    const env = profile?.trader.traderEnvId ? traderEnvDict[profile.trader.traderEnvId] : undefined
    return { profile, env }
  }) || []

  const comboHoldings = comboDetail?.holdings || []

  useEffect(() => {
    if (comboDetail) return
    dispatch(actions.fetchSystemTraderCombos())
  }, [comboDetail, dispatch])

  const handleClickCombo = (comboId: number) => {
    setFocusedComboId(comboId)
  }

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleChangeChartIndex = (index: number) => {
    dispatch(contentSlice.actions.changeActiveTraderChartIndex(index))
  }

  if (!comboBase || !comboDetail) return null

  return (
    <section
      data-testid='topCombos'
      className='detail-root'
    >
      <DisclaimerModal />
      <header className='detail-header'>
        <section className='flex'>
          {systemCombos.map((combo) => (
            <div
              key={combo.id}
              className='m-2'
            >
              <TraderComboCard
                traderCombo={combo}
                isActive={combo.id === focusedComboId}
                onClick={handleClickCombo}
              />
            </div>
          ))}
        </section>
      </header>
      <section className='page-root'>
        <section className='page-main'>
          <PageTitle
            className='mb-4'
            icon='performance'
            title={localeTool.t('traderCombo.pastPerformance')}
          />
          <ValueChangePanel
            className='mb-4'
            yearlyPercentNumber={comboDetail.yearlyPercentNumber}
            pastYearPercentNumber={comboDetail.pastYearPercentNumber}
            pastQuarterPercentNumber={comboDetail.pastQuarterPercentNumber}
            pastMonthPercentNumber={comboDetail.pastMonthPercentNumber}
            pastWeekPercentNumber={comboDetail.pastWeekPercentNumber}
            oneDecadeTrends={comboDetail.oneDecadeTrends}
            oneYearTrends={comboDetail.oneYearTrends}
            totalValue={comboDetail.totalValue}
            activeChartIndex={activeChartIndex}
            onChangeChart={handleChangeChartIndex}
            showPercents
            showCharts
          />
          <PageTitle
            icon='history'
            title={localeTool.t('topCombos.history')}
          />
          <section className='flex flex-col'>
            {comboHoldings.map((detail, index) => (
              <HoldingCard
                key={detail.date}
                className='mt-6 w-full'
                holding={detail}
                previousHolding={index < comboHoldings.length - 1 ? comboHoldings[index + 1] : null}
                initialValue={constants.Trader.Initial.Cash * 10}
              />
            ))}
          </section>
        </section>
        <section className='page-aside'>
          <PageTitle
            title={localeTool.t('traderCombo.includedProfiles')}
            className='mb-4'
          />
          <section className='flex flex-col mb-4'>
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
        </section>
      </section>
    </section>
  )
}

export default TopCombos
