import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Alert } from 'flowbite-react'
import TraderProfileCard from './TraderProfileCard'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const cardClass = 'w-96 m-4'
const titleClass = 'font-semibold mb-4'

const EachTops = ({
  bestOverall,
  bestPastYear,
  bestPastQuarter,
  bestPastMonth,
  bestPastWeek,
}: {
  bestOverall?: number,
  bestPastYear?: number,
  bestPastQuarter?: number,
  bestPastMonth?: number,
  bestPastWeek?: number,
}) => {
  const navigate = useNavigate()

  const traderProfileDict = useSelector(selectors.selectTraderProfileBaseDict())
  const hasResult = bestOverall || bestPastYear || bestPastQuarter || bestPastMonth || bestPastWeek

  const handleClickCard = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  if (!hasResult) {
    return (
      <Alert
        color='warning'
        className='mt-4'
      >
        {localeTool.t('traderEnv.noResultYet')}
      </Alert>
    )
  }

  return (
    <section className='flex flex-wrap'>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.yearlyTitle')}:
        </h3>
        <TraderProfileCard
          profile={traderProfileDict[bestOverall || 0]}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastYearTitle')}:
        </h3>
        <TraderProfileCard
          profile={traderProfileDict[bestPastYear || 0]}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastQuarterTitle')}:
        </h3>
        <TraderProfileCard
          profile={traderProfileDict[bestPastQuarter || 0]}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastMonthTitle')}:
        </h3>
        <TraderProfileCard
          profile={traderProfileDict[bestPastMonth || 0]}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastWeekTitle')}:
        </h3>
        <TraderProfileCard
          profile={traderProfileDict[bestPastWeek || 0]}
          onClick={handleClickCard}
        />
      </div>
    </section>
  )
}

export default EachTops
