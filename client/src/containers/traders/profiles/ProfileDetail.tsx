import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import * as constants from '@shared/constants'
import useTraderRequest from 'requests/useTraderRequest'
import useTraderState from 'states/useTraderState'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useShowMore from 'handlers/useShowMore'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import HoldingCard from 'containers/traders/blocks/HoldingCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import PageTitle from 'containers/elements/PageTitle'

const ProfileDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

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
        <TraderProfileCard
          className='w-80'
          profile={profileDetail}
        />
        <PageTitle
          title={localeTool.t('common.environments')}
          className='my-4'
        />
        {profileEnvs.map((profileEnv) => {
          const traderEnv = getTraderEnv(profileEnv.traderEnvId)
          if (!traderEnv) return null

          return (
            <TraderEnvCard
              key={profileEnv.traderEnvId}
              className='w-80 mb-4'
              traderEnv={traderEnv.record}
              isActive={profileDetail.trader.traderEnvId === profileEnv.traderEnvId}
              onClick={() => handleClickEnv(profileEnv.traderId, profileEnv.accessCode)}
            />
          )
        })}
      </aside>
    </section>
  )
}

export default ProfileDetail
