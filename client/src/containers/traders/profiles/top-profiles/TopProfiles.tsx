import { useEffect } from 'react'
import useTraderState from '../../../../states/useTraderState'
import TopProfileList from './TopProfileList'
import * as commonEnum from '../../../../enums/common'
import * as localeTool from '../../../../tools/locale'

const TopProfiles = () => {
  const { getTopProfiles, fetchTopProfiles } = useTraderState()

  const topProfiles = getTopProfiles(commonEnum.OVERALL_ENV_ID)

  useEffect(() => {
    if (topProfiles) return
    fetchTopProfiles(commonEnum.OVERALL_ENV_ID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProfiles])

  if (!topProfiles) return null

  return (
    <>
      <TopProfileList
        title={localeTool.t('bestReturn.yearlyTitle')}
        focusType='YEARLY'
        traderIds={topProfiles.yearly}
      />
      <TopProfileList
        title={localeTool.t('bestReturn.pastYearTitle')}
        focusType='PAST_YEAR'
        traderIds={topProfiles.pastYear}
      />
      <TopProfileList
        title={localeTool.t('bestReturn.pastQuarterTitle')}
        focusType='PAST_QUARTER'
        traderIds={topProfiles.pastQuarter}
      />
      <TopProfileList
        title={localeTool.t('bestReturn.pastMonthTitle')}
        focusType='PAST_MONTH'
        traderIds={topProfiles.pastMonth}
      />
      <TopProfileList
        title={localeTool.t('bestReturn.pastWeekTitle')}
        focusType='PAST_WEEK'
        traderIds={topProfiles.pastWeek}
      />
    </>
  )
}

export default TopProfiles
