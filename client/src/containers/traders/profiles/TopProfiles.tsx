import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useTraderState from 'states/useTraderState'
import useResourceState from 'states/useResourceState'
import useSystemRequest from 'requests/useSystemRequest'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import VariationList from 'containers/traders/elements/VariationList'

const TopProfiles = () => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { fetchOverallTopTraderProfiles } = useSystemRequest()
  const { getOverallTopTraderProfiles } = useResourceState()
  const { getTraderProfile } = useTraderState()
  const [focusType, setFocusType] = useState('YEARLY')

  const topTraderProfiles = getOverallTopTraderProfiles()

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
    fetchOverallTopTraderProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topTraderProfiles])

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
            profile={getTraderProfile(traderId)}
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
