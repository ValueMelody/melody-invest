import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Button, Divider, Label, Segment } from 'semantic-ui-react'
import useTrader from '../../states/useTraderProfile'
import * as routerConstant from '../../constants/router'
import * as localeTool from '../../tools/locale'
import * as parseTool from '../../tools/parse'
import TraderStats from './blocks/TraderStats'
import ValueDiffer from './elements/ValueDiffer'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  holdings: {
    width: '60%',
  },
  value: {
    marginLeft: '2rem !important',
    marginRight: '1rem !important',
  },
}))

const Profile = () => {
  const params = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const {
    getTraderProfile, fetchTraderProfile, getProfileHoldings, fetchProfileHoldings,
  } = useTrader()
  const [showAllHoldings, setShowAllHoldings] = useState(false)

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const traderProfile = getTraderProfile(traderId)
  const profileHoldings = getProfileHoldings(traderId)
  const holdings = profileHoldings || []
  const displayedHoldings = holdings.slice(0, showAllHoldings ? holdings.length : 5)
  console.log(displayedHoldings)

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerConstant.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderProfile) return
    fetchTraderProfile(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  useEffect(() => {
    if (profileHoldings) return
    fetchProfileHoldings(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileHoldings])

  const handleClickShowAll = () => setShowAllHoldings(true)

  if (!traderProfile || !profileHoldings) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <TraderStats
        trader={traderProfile.trader}
        pattern={traderProfile.pattern}
      />
      <div className={classes.holdings}>
        <h4><b>{localeTool.t('profile.history')}</b></h4>
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
                  currentHolding={holding}
                  previousHolding={holdings[index + 1]}
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

export default Profile
