import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import PageTitle from 'containers/elements/PageTitle'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import { useEffect } from 'react'
import usePrivateGuard from 'hooks/usePrivateGuard'
import useShowMore from 'hooks/useShowMore'

const ProfileDetail = () => {
  usePrivateGuard()
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { displayedTotal, renderShowMoreButton } = useShowMore()

  const traderId = params.traderId ? parseInt(params.traderId) : undefined
  const accessCode = params.accessCode || null

  const profileBase = useSelector(selectors.selectTraderProfileBaseById(traderId))
  const profileDetail = useSelector(selectors.selectTraderProfileDetailById(traderId))

  const envId = profileBase?.trader?.traderEnvId
  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(envId))
  const traderEnvDict = useSelector(selectors.selectTraderEnvBaseDict())
  const holdings = profileDetail?.holdings || []
  const profileEnvs = profileDetail?.profileEnvs || []
  const displayedHoldings = holdings.slice(0, displayedTotal)

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerTool.notFoundRoute())
  }, [accessCode, traderId, navigate])

  useEffect(() => {
    if (!traderId || accessCode?.length !== 16) return
    if (!profileBase) {
      dispatch(actions.fetchTraderProfile({ id: traderId, accessCode }))
    } else if (profileBase && !profileDetail) {
      dispatch(actions.fetchTraderProfileDetail({ id: traderId, accessCode }))
    }
  }, [profileBase, dispatch, traderId, accessCode, profileDetail])

  const handleClickEnv = (traderId: number, accessCode: string) => {
    const link = routerTool.profileDetailRoute(traderId, accessCode)
    navigate(link)
  }

  if (!profileBase || !profileDetail || !traderEnv) return null

  return (
    <section className='detail-root'>
      <header className='detail-header'>
        <TraderProfileCard
          className='w-full'
          profile={profileBase}
        />
      </header>
      <section className='page-root'>
        <section className='page-main'>
          <PageTitle
            icon='history'
            title={localeTool.t('profile.history')}
            className='mb-4'
          />
          {!displayedHoldings.length && (
            <Alert
              color='warning'
              className='mt-4'
            >
              {localeTool.t('profile.noResultYet')}
            </Alert>
          )}
          {displayedHoldings.map((holding, index) => (
            <HoldingCard
              key={holding.id}
              className='mb-6'
              holding={holding}
              previousHolding={index + 1 < holdings.length ? holdings[index + 1] : null}
              initialValue={constants.Trader.Initial.Cash}
            />
          ))}
          {displayedTotal < holdings.length && renderShowMoreButton()}
        </section>
        <aside className='page-aside'>
          <PageTitle
            title={localeTool.t('profile.environments')}
            className='my-4'
          />
          {profileEnvs.map((profileEnv) => (
            <TraderEnvCard
              key={profileEnv.traderEnvId}
              className='w-80 mb-4'
              traderEnv={traderEnvDict[profileEnv.traderEnvId]}
              isActive={profileBase.trader.traderEnvId === profileEnv.traderEnvId}
              onClick={() => handleClickEnv(profileEnv.traderId, profileEnv.accessCode)}
            />
          ))}
        </aside>
      </section>
    </section>
  )
}

export default ProfileDetail
