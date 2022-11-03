import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import VariationList from 'containers/traders/elements/VariationList'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'selectors'
import * as actions from 'actions'

const TopProfiles = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

  const [focusType, setFocusType] = useState('YEARLY')

  const topTraderProfiles = useSelector(selectors.selectSystemTopTraders())
  const traderProfileDict = useSelector(selectors.selectTraderProfileBaseDict())

  const topOptions = [
    {
      value: 'YEARLY',
      label: localeTool.t('bestReturn.yearlyTitle'),
      traders: topTraderProfiles?.yearly || [],
      onClick: () => setFocusType('YEARLY'),
    },
    {
      value: 'PAST_YEAR',
      label: localeTool.t('bestReturn.pastYearTitle'),
      traders: topTraderProfiles?.pastYear || [],
      onClick: () => setFocusType('PAST_YEAR'),
    },
    {
      value: 'PAST_QUARTER',
      label: localeTool.t('bestReturn.pastQuarterTitle'),
      traders: topTraderProfiles?.pastQuarter || [],
      onClick: () => setFocusType('PAST_QUARTER'),
    },
    {
      value: 'PAST_MONTH',
      label: localeTool.t('bestReturn.pastMonthTitle'),
      traders: topTraderProfiles?.pastMonth || [],
      onClick: () => setFocusType('PAST_MONTH'),
    },
    {
      value: 'PAST_WEEK',
      label: localeTool.t('bestReturn.pastWeekTitle'),
      traders: topTraderProfiles?.pastWeek || [],
      onClick: () => setFocusType('PAST_WEEK'),
    },
  ]

  const focusedTop = topOptions.find((option) => option.value === focusType)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (topTraderProfiles) return
    dispatch(actions.fetchSystemTopTraders())
  }, [topTraderProfiles, dispatch])

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

  if (!topTraderProfiles || !focusedTop) return null

  return (
    <section className='page-root'>
      <section className='page-main'>
        {focusedTop.traders.map((traderId) => (
          <TraderProfileCard
            key={traderId}
            className='mb-6'
            profile={traderProfileDict[traderId]}
            onClick={handleClickProfile}
          />
        ))}
      </section>
      <aside className='page-aside'>
        <h3 className='mb-4 font-bold'>
          {localeTool.t('bestReturn.type')}
        </h3>
        <VariationList
          options={topOptions}
          activeValue={focusType}
        />
      </aside>
    </section>
  )
}

export default TopProfiles
