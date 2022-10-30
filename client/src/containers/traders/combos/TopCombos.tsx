import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import useCommonState from 'states/useCommonState'
import useTraderState from 'states/useTraderState'
import useSystemRequest from 'requests/useSystemRequest'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import PageTitle from 'containers/elements/PageTitle'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const TopCombos = () => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const [focusedComboId, setFocusedComboId] = useState(-1)
  const { getTraderProfile, getTraderCombos } = useTraderState()

  const { fetchSystemTraderCombos } = useSystemRequest()
  const { getActiveChartIndex, setActiveChartIndex } = useCommonState()
  const activeChartIndex = getActiveChartIndex()

  const traderEnvDict = useSelector(selectors.selectTraderEnvBaseDict())

  const traderCombos = getTraderCombos()
  const systemCombos = traderCombos.filter((combo) => combo.identity.isSystem)
  const focusedCombo = systemCombos.find((combo) => combo.identity.id === focusedComboId) || null

  const profilesWithEnvs = focusedCombo?.identity.traderIds.map((traderId) => {
    const profile = getTraderProfile(traderId)
    const env = profile?.trader.traderEnvId ? traderEnvDict[profile?.trader.traderEnvId] : null
    return { profile, env }
  }) || []

  const comboHoldings = focusedCombo?.detail?.holdings || []

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (focusedCombo) return
    fetchSystemTraderCombos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedCombo])

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = (comboId: number) => {
    setFocusedComboId(comboId)
  }

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleChangeChartIndex = (index: number) => {
    setActiveChartIndex(index)
  }

  // ------------------------------------------------------------ UI --

  if (!focusedCombo || !focusedCombo.detail) return null

  return (
    <>
      <header className='flex border-b-4 border-primary mb-4 pb-4'>
        {systemCombos.map((combo) => (
          <div
            key={combo.identity.id}
            className='m-2'
          >
            <TraderComboCard
              traderCombo={combo.identity}
              isActive={combo.identity.id === focusedComboId}
              onClick={handleClickCombo}
            />
          </div>
        ))}
      </header>
      <section className='page-root'>
        <section className='page-main'>
          <PageTitle
            className='mb-4'
            icon='performance'
            title={localeTool.t('common.pastPerformance')}
          />
          <ValueChangePanel
            className='mb-4'
            yearlyPercentNumber={focusedCombo?.detail?.yearlyPercentNumber || null}
            pastYearPercentNumber={focusedCombo?.detail?.pastYearPercentNumber || null}
            pastQuarterPercentNumber={focusedCombo?.detail?.pastQuarterPercentNumber || null}
            pastMonthPercentNumber={focusedCombo?.detail?.pastMonthPercentNumber || null}
            pastWeekPercentNumber={focusedCombo?.detail?.pastWeekPercentNumber || null}
            oneDecadeTrends={focusedCombo?.detail?.oneDecadeTrends || null}
            oneYearTrends={focusedCombo?.detail?.oneYearTrends || null}
            totalValue={focusedCombo?.detail?.totalValue || null}
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
            {profilesWithEnvs.map((profileWithEnv) => (
              <ProfileValue
                key={profileWithEnv.profile?.trader.id}
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
    </>
  )
}

export default TopCombos
