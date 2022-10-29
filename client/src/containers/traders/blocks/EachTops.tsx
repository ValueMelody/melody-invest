import { useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import useTraderState from 'states/useTraderState'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderProfileCard from './TraderProfileCard'

const cardClass = 'w-96 m-4'
const titleClass = 'font-semibold mb-4'

const EachTops = ({
  bestOverall,
  bestPastYear,
  bestPastQuarter,
  bestPastMonth,
  bestPastWeek,
}: {
  bestOverall: number | null,
  bestPastYear: number | null,
  bestPastQuarter: number | null,
  bestPastMonth: number | null,
  bestPastWeek: number | null,
}) => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTraderProfile } = useTraderState()
  const hasResult = bestOverall || bestPastYear || bestPastQuarter || bestPastMonth || bestPastWeek

  // ------------------------------------------------------------ Handler --

  const handleClickCard = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

  if (!hasResult) {
    return (
      <Alert color='warning' className='mt-4'>
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
          profile={getTraderProfile(bestOverall)}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastYearTitle')}:
        </h3>
        <TraderProfileCard
          profile={getTraderProfile(bestPastYear)}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastQuarterTitle')}:
        </h3>
        <TraderProfileCard
          profile={getTraderProfile(bestPastQuarter)}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastMonthTitle')}:
        </h3>
        <TraderProfileCard
          profile={getTraderProfile(bestPastMonth)}
          onClick={handleClickCard}
        />
      </div>
      <div className={cardClass}>
        <h3 className={titleClass}>
          {localeTool.t('bestReturn.pastWeekTitle')}:
        </h3>
        <TraderProfileCard
          profile={getTraderProfile(bestPastWeek)}
          onClick={handleClickCard}
        />
      </div>
    </section>
  )
}

export default EachTops
