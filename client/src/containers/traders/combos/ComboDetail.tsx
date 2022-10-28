import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderRequest from 'requests/useTraderRequest'
import useCommonState from 'states/useCommonState'
import useTraderState from 'states/useTraderState'
import useShowMore from 'handlers/useShowMore'
import usePrivateGuard from 'handlers/usePrivateGuard'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import WatchButton from 'containers/traders/elements/WatchButton'
import PageTitle from 'containers/elements/PageTitle'

const useStyles = createUseStyles((theme: interfaces.common.Theme) => ({
  combo: {
    width: '100%',
    paddingBottom: '2rem !important',
    marginBottom: '2rem !important',
    borderBottom: `1px solid ${theme.PrimaryColor}`,
  },
  profileTitle: {
    margin: '1rem 0 !important',
  },
  portionTitle: {
    marginTop: '2rem !important',
  },
  profiles: {
    padding: '1rem',
  },
}))

const ComboDetail = () => {
  usePrivateGuard()

  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { traderClasses } = useTraderStyle()
  const { commonClasses } = useCommonStyle()
  const classes = useStyles()

  const { getActiveChartIndex, setActiveChartIndex } = useCommonState()
  const activeChartIndex = getActiveChartIndex()

  const { displayedTotal, renderShowMoreButton } = useShowMore()
  const { getTraderProfile, getTraderCombo, getTraderEnv } = useTraderState()
  const { fetchTraderCombo, deleteTraderCombo } = useTraderRequest()

  const comboId = params.comboId ? parseInt(params.comboId) : null
  const matchedCombo = getTraderCombo(comboId)

  const holdings = matchedCombo?.detail?.holdings || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  const profilesWithEnvs = matchedCombo?.identity.traderIds.map((traderId) => {
    const profile = getTraderProfile(traderId)
    const env = getTraderEnv(profile?.trader.traderEnvId || null)
    return { profile, env: env?.record || null }
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
    <section className={traderClasses.root}>
      <aside className={traderClasses.aside}>
        <div className={classNames(
          classes.combo,
          commonClasses.columnCenter,
        )}>
          <TraderComboCard
            traderCombo={matchedCombo.identity}
          />
          {!matchedCombo.identity.isSystem && (
            <WatchButton
              isWatched={true}
              onToggle={handleUnwatch}
            />
          )}
        </div>
        <PageTitle title={localeTool.t('traderCombo.includedProfiles')} className='mb-4' />
        <div className={commonClasses.columnCenter}>
          {profilesWithEnvs.map((profileWithEnv) => (
            <ProfileValue
              key={profileWithEnv.profile?.trader.id}
              trader={profileWithEnv.profile?.trader || null}
              env={profileWithEnv.env || null}
              onClick={handleClickProfile}
            />
          ))}
        </div>
        <PageTitle icon='pie' title={localeTool.t('traderCombo.profilePortion')} />
        <ComboProfiles
          profilesWithEnvs={profilesWithEnvs}
          onClickProfile={handleClickProfile}
        />
      </aside>
      <section className={traderClasses.main}>
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
        <PageTitle icon='history' title={localeTool.t('traderCombo.history')} />
        {!displayedHoldings.length && (
          <Alert color='warning' className='mt-4'>
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
    </section>
  )
}

export default ComboDetail
