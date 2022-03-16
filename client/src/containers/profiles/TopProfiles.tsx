import { useEffect } from 'react'
import useTraderProfile from '../../states/useTraderProfile'
import ProfileList from './blocks/ProfileList'
import * as localeTool from '../../tools/locale'

const TopProfiles = () => {
  const { topProfiles, fetchTopProfiles } = useTraderProfile()

  useEffect(() => {
    if (topProfiles) return
    fetchTopProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProfiles])

  if (!topProfiles) return null

  return (
    <>
      <ProfileList
        title={localeTool.t('top.yearly.title')}
        focusType='YEARLY'
        traderWithPatterns={topProfiles.yearly}
      />
      <ProfileList
        title={localeTool.t('top.pastYear.title')}
        focusType='PAST_YEAR'
        traderWithPatterns={topProfiles.pastYear}
      />
      <ProfileList
        title={localeTool.t('top.pastQuarter.title')}
        focusType='PAST_QUARTER'
        traderWithPatterns={topProfiles.pastQuarter}
      />
      <ProfileList
        title={localeTool.t('top.pastMonth.title')}
        focusType='PAST_MONTH'
        traderWithPatterns={topProfiles.pastMonth}
      />
      <ProfileList
        title={localeTool.t('top.pastWeek.title')}
        focusType='PAST_WEEK'
        traderWithPatterns={topProfiles.pastWeek}
      />
    </>
  )
}

export default TopProfiles
