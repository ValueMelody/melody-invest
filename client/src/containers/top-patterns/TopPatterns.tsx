import { useEffect } from 'react'
import usePattern from '../../states/usePattern'
import PatternsSection from './blocks/PatternsSection'

const TopPatterns = () => {
  const { topPatterns, fetchTopPatterns } = usePattern()
  console.log(topPatterns)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTopPatterns() }, [])

  if (!topPatterns) return null

  return (
    <div>
      <PatternsSection
        gainType="YEARLY"
        patterns={topPatterns.yearly}
      />
      <PatternsSection
        gainType="PAST_YEAR"
        patterns={topPatterns.pastYear}
      />
      <PatternsSection
        gainType="PAST_QUARTER"
        patterns={topPatterns.pastQuarter}
      />
      <PatternsSection
        gainType="PAST_MONTH"
        patterns={topPatterns.pastMonth}
      />
      <PatternsSection
        gainType="PAST_WEEK"
        patterns={topPatterns.pastWeek}
      />
    </div>
  )
}

export default TopPatterns
