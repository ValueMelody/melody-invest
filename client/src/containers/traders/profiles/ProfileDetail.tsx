import * as constants from '@shared/constants'
import useTraderState from '../../../states/useTraderState'
import useUserState from '../../../states/useUserState'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import ProfileCard from '../blocks/ProfileCard'
import HoldingCard from '../blocks/HoldingCard'
import TraderEnvCard from '../elements/TraderEnvCard'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: '28rem',
  },
  holdings: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  envContainer: {
    paddingLeft: '1rem !important',
    paddingRight: '1rem !important',
  },
}))

const ProfileDetail = () => {
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const {
    getTraderProfile, getProfileDetail, fetchTraderProfile, fetchProfileDetail,
  } = useTraderState()
  const { getUser } = useUserState()

  const [showHoldingTotal, setShowHoldingTotal] = vendorTool.react.useState(5)

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const user = getUser()

  const traderProfile = getTraderProfile(traderId)
  const profileDetail = getProfileDetail(traderId)

  const envId = traderProfile?.trader?.traderEnvId || null
  const traderEnv = user.userTraderEnvs.find((env) => env.id === envId) || null
  const holdings = profileDetail?.holdings || []
  const profileEnvs = profileDetail?.profileEnvs || []
  const displayedHoldings = holdings.slice(0, showHoldingTotal)

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (traderProfile || !traderId || !accessCode) return
    fetchTraderProfile(traderId, accessCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  vendorTool.react.useEffect(() => {
    if (profileDetail || !traderId || !accessCode) return
    fetchProfileDetail(traderId, accessCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickShowMore = () => {
    setShowHoldingTotal(showHoldingTotal + 10)
  }

  const handleClickEnv = (traderId: number, accessCode: string) => {
    const link = routerTool.profileDetailRoute(traderId, accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!traderProfile || !profileDetail || !traderEnv) return null

  return (
    <div className={vendorTool.classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <ProfileCard
          profile={traderProfile}
        />
        <div className={classes.envContainer}>
          <h4>{localeTool.t('common.environments')}:</h4>
          {profileEnvs.map((profileEnv) => {
            const traderEnv = user.userTraderEnvs.find((env) => env.id === profileEnv.traderEnvId)
            if (!traderEnv) return null

            return (
              <TraderEnvCard
                key={profileEnv.traderEnvId}
                traderEnv={traderEnv}
                isActive={traderProfile.trader.traderEnvId === profileEnv.traderEnvId}
                onClick={() => handleClickEnv(profileEnv.traderId, profileEnv.accessCode)}
              />
            )
          })}
        </div>
      </div>
      <div className={classes.holdings}>
        <vendorTool.ui.Header
          as='h3'
          icon='history'
          content={localeTool.t('profile.history')}
        />
        {!displayedHoldings.length && (
          <vendorTool.ui.Segment>
            {localeTool.t('profile.noResultYet')}
          </vendorTool.ui.Segment>
        )}
        {displayedHoldings.map((holding, index) => (
          <HoldingCard
            key={holding.id}
            holding={holding}
            previousHolding={index + 1 < holdings.length ? holdings[index + 1] : null}
            initialValue={constants.trader.initial.CASH}
          />
        ))}
        {showHoldingTotal < holdings.length && (
          <div className='row-around'>
            <vendorTool.ui.Button onClick={handleClickShowMore}>
              {localeTool.t('profile.showMoreHistory')}
            </vendorTool.ui.Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileDetail
