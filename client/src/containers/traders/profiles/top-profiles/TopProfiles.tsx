import { useEffect } from 'react'
import useTraderState from '../../../../states/useTraderState'
import TopProfileList from './TopProfileList'
import * as localeTool from '../../../../tools/locale'

const TopProfiles = () => {
  const { topProfiles, fetchTopProfiles } = useTraderState()

  useEffect(() => {
    if (topProfiles) return
    fetchTopProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProfiles])

  if (!topProfiles) return null

  return (
    <>
      <TopProfileList
        title={localeTool.t('top.yearly.title')}
        focusType='YEARLY'
        profiles={topProfiles.yearly}
      />
      <TopProfileList
        title={localeTool.t('top.pastYear.title')}
        focusType='PAST_YEAR'
        profiles={topProfiles.pastYear}
      />
      <TopProfileList
        title={localeTool.t('top.pastQuarter.title')}
        focusType='PAST_QUARTER'
        profiles={topProfiles.pastQuarter}
      />
      <TopProfileList
        title={localeTool.t('top.pastMonth.title')}
        focusType='PAST_MONTH'
        profiles={topProfiles.pastMonth}
      />
      <TopProfileList
        title={localeTool.t('top.pastWeek.title')}
        focusType='PAST_WEEK'
        profiles={topProfiles.pastWeek}
      />
    </>
  )
}

export default TopProfiles
