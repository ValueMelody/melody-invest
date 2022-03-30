import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Button, Divider, Label, Segment } from 'semantic-ui-react'
import useTraderState from '../../states/useTraderState'
import useTickerState from '../../states/useTickerState'
import * as routerEnum from '../../enums/router'
import * as localeTool from '../../tools/locale'
import * as parseTool from '../../tools/parse'
import ProfileCard from './blocks/ProfileCard'
import ValueDiffer from './elements/ValueDiffer'
import HoldingShare from './elements/HoldingShare'
import TraderEnvCard from './elements/TraderEnvCard'

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
  value: {
    marginLeft: '2rem !important',
    marginRight: '1rem !important',
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
  const {
    getTraderProfile, getTraderEnv, getProfileDetail,
    fetchTraderProfile, fetchProfileDetail,
  } = useTraderState()
  const { getTickerIdentity } = useTickerState()

  const [showAllHoldings, setShowAllHoldings] = useState(false)

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const traderProfile = getTraderProfile(traderId)
  const profileDetail = getProfileDetail(traderId)
  const traderEnv = traderProfile?.trader && getTraderEnv(traderProfile.trader.traderEnvId)
  const holdings = profileDetail?.holdings || []
  const profileEnvs = profileDetail?.profileEnvs || []
  const displayedHoldings = holdings.slice(0, showAllHoldings ? holdings.length : 5)

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerEnum.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderProfile) return
    fetchTraderProfile(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  useEffect(() => {
    if (profileDetail) return
    fetchProfileDetail(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetail])

  const handleClickShowAll = () => setShowAllHoldings(true)

  const handleClickEnv = (traderId: number, accessCode: string) => {
    const link = `${routerEnum.NAV.PROFILES}/${traderId}/${accessCode}`
    navigate(link)
  }

  if (!traderProfile || !profileDetail || !traderEnv) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <ProfileCard
          trader={traderProfile.trader}
          pattern={traderProfile.pattern}
        />
        <div className={classes.envContainer}>
          <h4>{localeTool.t('common.envs')}:</h4>
          {profileEnvs.map((profileEnv) => {
            const traderEnv = getTraderEnv(profileEnv.traderEnvId)!
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
        <h2>{localeTool.t('profile.history')}</h2>
        {!displayedHoldings.length && (
          <Segment>{localeTool.t('profile.noResultYet')}</Segment>
        )}
        {displayedHoldings.map((holding, index) => (
          <Segment key={holding.id}>
            <div className='row-start'>
              <Label>
                {localeTool.t('common.date')}: {holding.date}
              </Label>
              {holding.totalValue !== null && (
                <h5 className={classes.value}>
                  <b>{localeTool.t('common.totalValue')}:</b>&nbsp;
                  {parseTool.holdingValue(holding.totalValue)}
                </h5>
              )}
              {index + 1 < holdings.length && (
                <ValueDiffer
                  currentValue={holding.totalValue}
                  previousValue={holdings[index + 1].totalValue}
                />
              )}
              {holding.totalCash !== null && (
                <h5>
                  <b>{localeTool.t('common.cash')}:</b>&nbsp;
                  {parseTool.holdingValue(holding.totalCash)}
                </h5>
              )}
            </div>
            <Divider />
            {holding.holdings.map((tickerHolding) => {
              const identity = getTickerIdentity(tickerHolding.tickerId)
              return (
                <HoldingShare
                  key={tickerHolding.tickerId}
                  tickerIdentity={identity}
                  tickerHolding={tickerHolding}
                  previousHoldings={holdings[index + 1]?.holdings}
                />
              )
            })}
          </Segment>
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
