import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import useCommonState from 'states/useCommonState'
import useTraderState from 'states/useTraderState'
import useSystemRequest from 'requests/useSystemRequest'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import ComboProfiles from 'containers/traders/elements/ComboProfiles'
import ProfileValue from 'containers/traders/elements/ProfileValue'
import ValueChangePanel from 'containers/traders/elements/ValueChangePanel'

const useStyles = vendorTool.jss.createUseStyles((
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
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()
  const { traderClasses } = useTraderStyle()

  const [focusedComboId, setFocusedComboId] = vendorTool.react.useState(-1)
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

  vendorTool.react.useEffect(() => {
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
      <header className={vendorTool.classNames(
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
          <vendorTool.ui.Header
            as='h3'
            icon='history'
            content={localeTool.t('topCombos.history')}
          />
          {comboHoldings.map((detail, index) => (
            <HoldingCard
              key={detail.date}
              holding={detail}
              previousHolding={index < comboHoldings.length - 1 ? comboHoldings[index + 1] : null}
              initialValue={constants.Trader.Initial.Cash * 10}
            />
          ))}
        </section>
        <section className={traderClasses.aside}>
          <vendorTool.ui.Header
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
          <vendorTool.ui.Header
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
