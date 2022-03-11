import { useEffect } from 'react'
import useResource from '../../states/useResource'
import PatternsSection, { GAIN_TYPE } from './blocks/PatternsSection'
import * as localeTool from '../../tools/locale'

const TopPatterns = () => {
  const { topPatterns, fetchTopPatterns } = useResource()
  console.log(topPatterns)

  useEffect(() => {
    if (topPatterns) return
    fetchTopPatterns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topPatterns])

  if (!topPatterns) return null

  return (
    <div>
      <PatternsSection
        title={localeTool.t('topPatterns.titleYearly')}
        gainType={GAIN_TYPE.YEARLY}
        traderWithPatterns={topPatterns.yearly}
      />
      <PatternsSection
        title={localeTool.t('topPatterns.titlePastYear')}
        gainType={GAIN_TYPE.PAST_YEAR}
        traderWithPatterns={topPatterns.pastYear}
      />
      <PatternsSection
        title={localeTool.t('topPatterns.titlePastQuarter')}
        gainType={GAIN_TYPE.PAST_QUARTER}
        traderWithPatterns={topPatterns.pastQuarter}
      />
      <PatternsSection
        title={localeTool.t('topPatterns.titlePastMonth')}
        gainType={GAIN_TYPE.PAST_MONTH}
        traderWithPatterns={topPatterns.pastMonth}
      />
      <PatternsSection
        title={localeTool.t('topPatterns.titlePastWeek')}
        gainType={GAIN_TYPE.PAST_WEEK}
        traderWithPatterns={topPatterns.pastWeek}
      />
    </div>
  )
}

export default TopPatterns
