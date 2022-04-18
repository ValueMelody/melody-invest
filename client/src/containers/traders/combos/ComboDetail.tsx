import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import * as themeEnum from '../../../enums/theme'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'
import useShowMore from '../../hooks/useShowMore'
import usePrivateGuard from '../../hooks/usePrivateGuard'
import HoldingCard from '../blocks/HoldingCard'
import ProfileCard from '../blocks/ProfileCard'
import TraderComboCard from '../elements/TraderComboCard'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  combo: {
    width: '100%',
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    marginBottom: '2rem',
    paddingBottom: '2rem',
  },
  asideTitle: {
    marginBottom: '1rem !important',
  },
  profiles: {
    padding: '1rem',
  },
}))

const ComboDetail = () => {
  usePrivateGuard()

  const params = vendorTool.router.useParams()
  const { classes: pageClasses } = usePageStyles()
  const classes = useStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { displayedTotal, renderShowMoreButton } = useShowMore()

  const { getUser } = useUserState()
  const user = getUser()

  const { fetchTraderCombo, getProfileDetail } = useTraderState()

  const comboId = params.comboId ? parseInt(params.comboId) : null
  const matchedCombo = user.userTraderCombos.find((combo) => combo.identity.id === comboId)
  const matchedEnv = user.userTraderEnvs.find((env) => env.id === matchedCombo?.identity.traderEnvId)

  const holdings = matchedCombo?.holdings || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!matchedCombo || matchedCombo.holdings) return
    fetchTraderCombo(matchedCombo.identity.id)
  }, [matchedCombo])

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!matchedCombo || !matchedEnv) return null

  return (
    <section className={pageClasses.root}>
      <aside className={pageClasses.aside}>
        <div className={vendorTool.classNames(classes.combo, 'row-around')}>
          <TraderComboCard
            traderCombo={matchedCombo.identity}
            traderEnv={matchedEnv}
            isActive
          />
        </div>
        <vendorTool.ui.Header
          as='h3'
          icon='star'
          content={localeTool.t('common.includedProfiles')}
          className={classes.asideTitle}
        />
        {matchedCombo.identity.traderIds.map((traderId) => (
          <ProfileCard
            key={traderId}
            profile={getProfileDetail(traderId)}
            onClick={handleClickProfile}
          />
        ))}
      </aside>
      <section className={pageClasses.main}>
        <vendorTool.ui.Header
          as='h3'
          icon='history'
          content={localeTool.t('traderCombo.history')}
        />
        {!displayedHoldings.length && (
          <vendorTool.ui.Segment>
            {localeTool.t('traderCombo.noResultYet')}
          </vendorTool.ui.Segment>
        )}
        {displayedHoldings.map((detail, index) => (
          <HoldingCard
            key={detail.date}
            holding={detail}
            previousHolding={
              matchedCombo.holdings && index < matchedCombo.holdings.length - 1
                ? matchedCombo.holdings[index + 1]
                : null
            }
            initialValue={constants.trader.initial.CASH * matchedCombo.identity.traderIds.length}
          />
        ))}
        {displayedTotal < holdings.length && renderShowMoreButton()}
      </section>
    </section>
  )
}

export default ComboDetail
