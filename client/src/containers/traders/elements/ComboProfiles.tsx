import * as interfaces from '@shared/interfaces'
import WeightChart from './WeightChart'
import * as parseTool from '../../../tools/parse'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import TraderProfileCard from '../blocks/TraderProfileCard'

interface ProfileWithEnv {
  profile: interfaces.response.TraderProfile | null;
  env: interfaces.traderEnvModel.Record | null;
}

const ComboProfiles = ({
  profilesWithEnvs,
  onClickProfile,
}: {
  profilesWithEnvs: ProfileWithEnv[];
  onClickProfile: (trader: interfaces.traderModel.Record) => void;
}) => {
  // ------------------------------------------------------------ State --

  const chartData = profilesWithEnvs.map((profileWithEnv) => {
    const label = profileWithEnv.profile
      ? parseTool.profileName(profileWithEnv.profile.pattern.id)
      : ''
    const desc = profileWithEnv.env
      ? `${profileWithEnv.env.name} ${localeTool.t('common.env')}`
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

  const [activeIndex, setActiveIndex] = vendorTool.react.useState(largestIndex)

  // ------------------------------------------------------------ Handler --

  const handleChangeActive = (index: number) => setActiveIndex(index)

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    onClickProfile(trader)
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='column-center'>
      <WeightChart
        activeIndex={activeIndex}
        onMouseEnter={handleChangeActive}
        data={chartData}
      />
      <section className='column-start'>
        <TraderProfileCard
          profile={profilesWithEnvs[activeIndex].profile}
          onClick={handleClickProfile}
        />
      </section>
    </section>
  )
}

export default ComboProfiles
