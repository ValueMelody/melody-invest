import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderRequest from 'requests/useTraderRequest'
import useCommonState from 'states/useCommonState'
import useTraderState from 'states/useTraderState'
import useShowMore from 'handlers/useShowMore'
import usePrivateGuard from 'handlers/usePrivateGuard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import WatchButton from 'containers/traders/elements/WatchButton'
import PageTitle from 'containers/elements/PageTitle'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const ComboDetail = () => {
  usePrivateGuard()

  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getActiveChartIndex, setActiveChartIndex } = useCommonState()
  const activeChartIndex = getActiveChartIndex()

  const { displayedTotal, renderShowMoreButton } = useShowMore()
  const { getTraderProfile, getTraderCombo } = useTraderState()
  const { fetchTraderCombo, deleteTraderCombo } = useTraderRequest()

  const traderEnvDict = useSelector(selectors.selectTraderEnvBaseDict())

  const comboId = params.comboId ? parseInt(params.comboId) : null
  const matchedCombo = getTraderCombo(comboId)

  const holdings = matchedCombo?.detail?.holdings || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  const profilesWithEnvs = matchedCombo?.identity.traderIds.map((traderId) => {
    const profile = getTraderProfile(traderId)
    const env = profile?.trader.traderEnvId
      ? traderEnvDict[profile?.trader.traderEnvId]
      : null
    return { profile, env }
  }) || []

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!matchedCombo || matchedCombo?.detail) return
    fetchTraderCombo(matchedCombo.identity.id)
    // eslint-disable-next-line
  }, [matchedCombo])

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleChangeChartIndex = (index: number) => {
    setActiveChartIndex(index)
  }

  const handleUnwatch = async () => {
    if (!comboId) return
    await deleteTraderCombo(comboId)
  }

  // ------------------------------------------------------------ UI --

  if (!matchedCombo?.detail) return null

  return (
    <section className='page-root'>
      <section className='page-main'>
        <PageTitle
          icon='performance'
          title={localeTool.t('common.pastPerformance')}
        />
        <ValueChangePanel
          yearlyPercentNumber={matchedCombo?.detail?.yearlyPercentNumber || null}
          pastYearPercentNumber={matchedCombo?.detail?.pastYearPercentNumber || null}
          pastQuarterPercentNumber={matchedCombo?.detail?.pastQuarterPercentNumber || null}
          pastMonthPercentNumber={matchedCombo?.detail?.pastMonthPercentNumber || null}
          pastWeekPercentNumber={matchedCombo?.detail?.pastWeekPercentNumber || null}
          oneDecadeTrends={matchedCombo?.detail?.oneDecadeTrends || null}
          oneYearTrends={matchedCombo?.detail?.oneYearTrends || null}
          totalValue={matchedCombo?.detail?.totalValue || null}
          activeChartIndex={activeChartIndex}
          onChangeChart={handleChangeChartIndex}
          showPercents
          showCharts
        />
        <PageTitle
          icon='history'
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
            className='mt-6'
            holding={detail}
            previousHolding={index < holdings.length - 1 ? holdings[index + 1] : null}
            initialValue={constants.Trader.Initial.Cash * matchedCombo.identity.traderIds.length}
          />
        ))}
        {displayedTotal < holdings.length && renderShowMoreButton()}
      </section>
      <aside className='page-aside'>
        <header className='pb-4 mb-4 flex flex-col'>
          <TraderComboCard
            className='mb-4'
            traderCombo={matchedCombo.identity}
          />
          {!matchedCombo.identity.isSystem && (
            <WatchButton
              isWatched={true}
              onToggle={handleUnwatch}
            />
          )}
        </header>
        <PageTitle
          title={localeTool.t('traderCombo.includedProfiles')}
          className='mb-4'
        />
        <section className='mb-4'>
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
      </aside>
    </section>
  )
}

export default ComboDetail
