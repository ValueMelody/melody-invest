import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderComboCard from '../elements/TraderComboCard'
import ComboProfiles from '../elements/ComboProfiles'
import ProfileValue from '../elements/ProfileValue'
import HoldingCard from '../blocks/HoldingCard'
import ComboStats from '../blocks/ComboStats'
import * as themeEnum from '../../../enums/theme'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
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

  const profilesWithEnvs = focusedCombo?.identity.traderIds.map((traderId) => {
    const profile = getProfileDetail(traderId)
    const env = user.userTraderEnvs.find((env) => env.id === profile?.trader.traderEnvId) || null
    return { profile, env }
  }) || []

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = (comboId: number) => {
    setFocusedComboId(comboId)
  }

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

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
          <ComboStats combo={focusedCombo} />
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
              initialValue={constants.Trader.Initial.Cash * 10}
            />
          ))}
        </section>
        <section className={pageClasses.aside}>
          <vendorTool.ui.Header
            as='h3'
            icon='star'
            content={localeTool.t('traderCombo.includedProfiles')}
            className={classes.valueTitle}
          />
          <div className='column-center'>
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
