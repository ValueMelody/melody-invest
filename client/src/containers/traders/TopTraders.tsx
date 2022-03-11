import { useEffect } from 'react'
import useTrader from '../../states/useTrader'
import TraderSection, { GAIN_TYPE } from './blocks/TraderSection'
import * as localeTool from '../../tools/locale'

const TopTraders = () => {
  const { topTraders, fetchTopTraders } = useTrader()

  useEffect(() => {
    if (topTraders) return
    fetchTopTraders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topTraders])

  if (!topTraders) return null

  return (
    <div>
      <TraderSection
        title={localeTool.t('topPatterns.titleYearly')}
        gainType={GAIN_TYPE.YEARLY}
        traderWithPatterns={topTraders.yearly}
      />
      <TraderSection
        title={localeTool.t('topPatterns.titlePastYear')}
        gainType={GAIN_TYPE.PAST_YEAR}
        traderWithPatterns={topTraders.pastYear}
      />
      <TraderSection
        title={localeTool.t('topPatterns.titlePastQuarter')}
        gainType={GAIN_TYPE.PAST_QUARTER}
        traderWithPatterns={topTraders.pastQuarter}
      />
      <TraderSection
        title={localeTool.t('topPatterns.titlePastMonth')}
        gainType={GAIN_TYPE.PAST_MONTH}
        traderWithPatterns={topTraders.pastMonth}
      />
      <TraderSection
        title={localeTool.t('topPatterns.titlePastWeek')}
        gainType={GAIN_TYPE.PAST_WEEK}
        traderWithPatterns={topTraders.pastWeek}
      />
    </div>
  )
}

export default TopTraders
