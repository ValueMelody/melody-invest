import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import useTraderRequest from 'requests/useTraderRequest'
import useTraderState from 'states/useTraderState'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useShowMore from 'handlers/useShowMore'
import useCommonStyle from 'styles/useCommonStyle'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import PageTitle from 'containers/elements/PageTitle'

const useStyles = createUseStyles(({
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
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const { getTraderProfile, getTraderEnv } = useTraderState()
  const { fetchTraderProfile, fetchProfileDetail } = useTraderRequest()

  const { displayedTotal, renderShowMoreButton } = useShowMore()

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null

  const profileDetail = getTraderProfile(traderId)

  const envId = profileDetail?.trader?.traderEnvId || null
  const traderEnv = getTraderEnv(envId)
  const holdings = profileDetail?.holdings || []
  const profileEnvs = profileDetail?.profileEnvs || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!traderId || !accessCode) return
    if (!profileDetail) {
      fetchTraderProfile(traderId, accessCode)
    } else if (profileDetail && !profileDetail.holdings) {
      fetchProfileDetail(traderId, accessCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = (traderId: number, accessCode: string) => {
    const link = routerTool.profileDetailRoute(traderId, accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

  if (!profileDetail || !profileDetail || !traderEnv) return null

  return (
    <div className={classNames(
      commonClasses.rowBetween,
      classes.container,
    )}>
      <div className={classes.left}>
        <TraderProfileCard
          profile={profileDetail}
        />
        <div className={classes.envContainer}>
          <h4>{localeTool.t('common.environments')}:</h4>
          {profileEnvs.map((profileEnv) => {
            const traderEnv = getTraderEnv(profileEnv.traderEnvId)
            if (!traderEnv) return null

            return (
              <TraderEnvCard
                key={profileEnv.traderEnvId}
                traderEnv={traderEnv.record}
                isActive={profileDetail.trader.traderEnvId === profileEnv.traderEnvId}
                onClick={() => handleClickEnv(profileEnv.traderId, profileEnv.accessCode)}
              />
            )
          })}
        </div>
      </div>
      <div className={classes.holdings}>
        <PageTitle icon='history' title={localeTool.t('profile.history')} />
        {!displayedHoldings.length && (
          <Alert color='warning' className='mt-4'>
            {localeTool.t('profile.noResultYet')}
          </Alert>
        )}
        {displayedHoldings.map((holding, index) => (
          <HoldingCard
            key={holding.id}
            className='mt-6'
            holding={holding}
            previousHolding={index + 1 < holdings.length ? holdings[index + 1] : null}
            initialValue={constants.Trader.Initial.Cash}
          />
        ))}
        {displayedTotal < holdings.length && renderShowMoreButton()}
      </div>
    </div>
  )
}

export default ProfileDetail
