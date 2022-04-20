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
import ComboProfiles from '../elements/ComboProfiles'
import TraderComboCard from '../elements/TraderComboCard'
import ProfileValue from '../elements/ProfileValue'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  combo: {
    width: '100%',
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

  const profilesWithEnvs = matchedCombo?.identity.traderIds.map((traderId) => {
    const profile = getProfileDetail(traderId)
    const env = user.userTraderEnvs.find((env) => env.id === profile?.trader.traderEnvId) || null
    return { profile, env }
  }) || []

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

  // ------------------------------------------------------------ UI --

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
          className={classes.profileTitle}
          content={localeTool.t('traderCombo.includedProfiles')}
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
          className={classes.portionTitle}
          content={localeTool.t('traderCombo.profilePortion')}
        />
        <ComboProfiles
          profilesWithEnvs={profilesWithEnvs}
          onClickProfile={handleClickProfile}
        />
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
