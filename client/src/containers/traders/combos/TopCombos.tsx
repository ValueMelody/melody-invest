import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderComboCard from '../elements/TraderComboCard'
import HoldingCard from '../blocks/HoldingCard'
import ProfileCard from '../blocks/ProfileCard'
import * as themeEnum from '../../../enums/theme'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  header: {
    width: '100%',
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
  },
  asideTitle: {
    marginBottom: '1rem !important',
  },
}))

const TopCombos = () => {
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const [focusedComboId, setFocusedComboId] = vendorTool.react.useState(-1)
  const { getProfileDetail } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()
  const systemCombos = user.userTraderCombos.filter((combo) => combo.identity.isSystem)
  const focusedCombo = systemCombos.find((combo) => combo.identity.id === focusedComboId) || null

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = (comboId: number) => {
    setFocusedComboId(comboId)
  }

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!focusedCombo || !focusedCombo.holdings) return null

  return (
    <section className='column-start'>
      <header className={vendorTool.classNames('row-start', classes.header)}>
        {systemCombos.map((combo) => {
          const env = user.userTraderEnvs.find((env) => env.id === combo.identity.traderEnvId) || null
          return (
            <TraderComboCard
              key={combo.identity.id}
              traderCombo={combo.identity}
              traderEnv={env}
              isActive={combo.identity.id === focusedComboId}
              onClick={handleClickCombo}
            />
          )
        })}
      </header>
      <section className={pageClasses.root}>
        <section className={pageClasses.main}>
          <vendorTool.ui.Header
            as='h3'
            icon='history'
            content={localeTool.t('topCombos.history')}
          />
          {focusedCombo.holdings.map((detail, index) => (
            <HoldingCard
              key={detail.date}
              holding={detail}
              previousHolding={
                focusedCombo.holdings && index < focusedCombo.holdings.length - 1
                  ? focusedCombo.holdings[index + 1]
                  : null
              }
              initialValue={constants.trader.initial.CASH * 10}
            />
          ))}
        </section>
        <section className={pageClasses.aside}>
          <vendorTool.ui.Header
            as='h3'
            icon='star'
            content={localeTool.t('common.includedProfiles')}
            className={classes.asideTitle}
          />
          {focusedCombo.identity.traderIds.map((traderId) => (
            <ProfileCard
              key={traderId}
              profile={getProfileDetail(traderId)}
              onClick={handleClickProfile}
            />
          ))}
        </section>
      </section>
    </section>
  )
}

export default TopCombos
