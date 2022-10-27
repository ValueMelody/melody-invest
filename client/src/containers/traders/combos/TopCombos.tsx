import { useEffect, useState } from 'react'
import { Header } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import useCommonState from 'states/useCommonState'
import useTraderState from 'states/useTraderState'
import useSystemRequest from 'requests/useSystemRequest'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import ComboProfiles from 'containers/traders/blocks/ComboProfiles'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'

const useStyles = createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  header: {
    width: '100%',
    borderBottom: `3px solid ${theme.PrimaryColor}`,
    paddingBottom: '1.5rem',
    marginBottom: '1rem',
  },
  portionTitle: {
    marginTop: '2rem !important',
  },
  valueTitle: {
    marginBottom: '1rem !important',
  },
}))

const TopCombos = () => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()
  const { traderClasses } = useTraderStyle()

  const [focusedComboId, setFocusedComboId] = useState(-1)
  const { getTraderProfile, getTraderCombos, getTraderEnv } = useTraderState()

  const { fetchSystemTraderCombos } = useSystemRequest()
  const { getActiveChartIndex, setActiveChartIndex } = useCommonState()
  const activeChartIndex = getActiveChartIndex()

  const traderCombos = getTraderCombos()
  const systemCombos = traderCombos.filter((combo) => combo.identity.isSystem)
  const focusedCombo = systemCombos.find((combo) => combo.identity.id === focusedComboId) || null

  const profilesWithEnvs = focusedCombo?.identity.traderIds.map((traderId) => {
    const profile = getTraderProfile(traderId)
    const env = getTraderEnv(profile?.trader.traderEnvId || null)
    return { profile, env: env?.record || null }
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
    <section className={commonClasses.columnStart}>
      <header className={classNames(
        commonClasses.rowStart,
        classes.header,
      )}>
        {systemCombos.map((combo) => (
            <TraderComboCard
              key={combo.identity.id}
              traderCombo={combo.identity}
              isActive={combo.identity.id === focusedComboId}
              onClick={handleClickCombo}
            />
        ))}
      </header>
      <section className={traderClasses.root}>
        <section className={traderClasses.main}>
          <ValueChangePanel
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
          <Header
            as='h3'
            icon='history'
            content={localeTool.t('topCombos.history')}
          />
          <section className='flex flex-wrap'>
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
        <section className={traderClasses.aside}>
          <Header
            as='h3'
            icon='star'
            content={localeTool.t('traderCombo.includedProfiles')}
            className={classes.valueTitle}
          />
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
          <Header
            as='h3'
            icon='pie chart'
            content={localeTool.t('traderCombo.profilePortion')}
            className={classes.portionTitle}
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
