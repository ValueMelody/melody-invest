import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import { useState } from 'react'
import WeightChart from '../elements/WeightChart'

interface ProfileWithEnv {
  profile?: interfaces.response.TraderProfile;
  env?: interfaces.traderEnvModel.Identity;
}

const ComboProfiles = ({
  profilesWithEnvs,
  onClickProfile,
}: {
  profilesWithEnvs: ProfileWithEnv[];
  onClickProfile: (trader: interfaces.traderModel.Record) => void;
}) => {
  const chartData = profilesWithEnvs.map((profileWithEnv) => {
    const label = profileWithEnv.profile
      ? parseTool.profileName(profileWithEnv.profile.pattern.id)
      : ''
    const desc = profileWithEnv.env
      ? `${profileWithEnv.env.name} ${localeTool.t('entity.env')}`
      : ''
    return {
      label,
      desc,
      value: profileWithEnv.profile?.trader.totalValue || 0,
    }
  })

  const largestIndex = chartData.reduce((currentIndex, dataset, index) => {
    const curr = chartData[currentIndex]
    return curr.value < dataset.value ? index : currentIndex
  }, 0)

  const [activeIndex, setActiveIndex] = useState(largestIndex)

  const handleChangeActive = (index: number) => setActiveIndex(index)

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    onClickProfile(trader)
  }

  return (
    <section className='flex flex-col items-center'>
      <WeightChart
        activeIndex={activeIndex}
        onMouseEnter={handleChangeActive}
        data={chartData}
      />
      <TraderProfileCard
        className='w-80 [&>div]:p-4'
        disabledUnwatch
        profile={profilesWithEnvs[activeIndex]?.profile}
        onClick={handleClickProfile}
      />
    </section>
  )
}

export default ComboProfiles
