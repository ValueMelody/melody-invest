import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Button, Segment, Header } from 'semantic-ui-react'
import useTraderState from '../../../states/useTraderState'
import useUserState from '../../../states/useUserState'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import ProfileCard from '../blocks/ProfileCard'
import HoldingCard from '../blocks/HoldingCard'
import TraderEnvCard from '../elements/TraderEnvCard'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: '28rem',
  },
  holdings: {
    width: 'calc(100% - 32rem)',
    minWidth: '38rem',
  },
  envContainer: {
    paddingLeft: '1rem !important',
    paddingRight: '1rem !important',
  },
}))

const ProfileDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const {
    getTraderProfile, getProfileDetail, fetchTraderProfile, fetchProfileDetail,
  } = useTraderState()
  const { getUser } = useUserState()

  const [showAllHoldings, setShowAllHoldings] = useState(false)

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const user = getUser()

  const traderProfile = getTraderProfile(traderId)
  const profileDetail = getProfileDetail(traderId)

  const envId = traderProfile?.trader?.traderEnvId || null
  const traderEnv = user.userTraderEnvs.find((env) => env.id === envId) || null
  const holdings = profileDetail?.holdings || []
  const profileEnvs = profileDetail?.profileEnvs || []
  const displayedHoldings = holdings.slice(0, showAllHoldings ? holdings.length : 5)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderProfile || !traderId || !accessCode) return
    fetchTraderProfile(traderId, accessCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  useEffect(() => {
    if (profileDetail || !traderId || !accessCode) return
    fetchProfileDetail(traderId, accessCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickShowAll = () => setShowAllHoldings(true)

  const handleClickEnv = (traderId: number, accessCode: string) => {
    const link = routerTool.profileDetailRoute(traderId, accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!traderProfile || !profileDetail || !traderEnv) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <ProfileCard
          profile={traderProfile}
        />
        <div className={classes.envContainer}>
          <h4>{localeTool.t('common.envs')}:</h4>
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
        <Header
          as='h3'
          icon='history'
          content={localeTool.t('profile.history')}
        />
        {!displayedHoldings.length && (
          <Segment>{localeTool.t('profile.noResultYet')}</Segment>
        )}
        {displayedHoldings.map((holding, index) => (
          <HoldingCard
            key={holding.id}
            holding={holding}
            previousHolding={index + 1 < holdings.length ? holdings[index + 1] : null}
          />
        ))}
        {!showAllHoldings && displayedHoldings.length !== holdings.length && (
          <div className='row-around'>
            <Button onClick={handleClickShowAll}>
              {localeTool.t('common.showAll')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileDetail
