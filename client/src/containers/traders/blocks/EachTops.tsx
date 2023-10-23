import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TraderProfileCard from './TraderProfileCard'

const sectionClass = 'w-full m-4 max-sm:w-80'
const titleClass = 'font-semibold mb-4'
const cardClass = 'mb-4'

const EachTops = ({
  bestOveralls,
  bestPastYears,
  bestPastQuarters,
  bestPastMonths,
  bestPastWeeks,
}: {
  bestOveralls: number[];
  bestPastYears: number[];
  bestPastQuarters: number[];
  bestPastMonths: number[];
  bestPastWeeks: number[];
}) => {
  const navigate = useNavigate()

  const traderProfileDict = useSelector(selectors.selectTraderProfileBaseDict())
  const hasResult = bestOveralls.length || bestPastYears.length || bestPastQuarters.length ||
    bestPastMonths.length || bestPastWeeks.length

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
    <section className='flex flex-col'>
      {!!bestOveralls.length && (
        <div
          data-testid='card'
          className={sectionClass}
        >
          <h3 className={titleClass}>
            {localeTool.t('bestReturn.yearlyTitle')}:
          </h3>
          {bestOveralls.map((bestOveralls) => (
            <TraderProfileCard
              key={bestOveralls}
              className={cardClass}
              profile={traderProfileDict[bestOveralls]}
              onClick={handleClickCard}
            />
          ))}
        </div>
      )}
      {!!bestPastYears.length && (
        <div
          data-testid='card'
          className={sectionClass}
        >
          <h3 className={titleClass}>
            {localeTool.t('bestReturn.pastYearTitle')}:
          </h3>
          {bestPastYears.map((bestPastYear) => (
            <TraderProfileCard
              key={bestPastYear}
              className={cardClass}
              profile={traderProfileDict[bestPastYear]}
              onClick={handleClickCard}
            />
          ))}
        </div>
      )}
      {!!bestPastQuarters.length && (
        <div
          data-testid='card'
          className={sectionClass}
        >
          <h3 className={titleClass}>
            {localeTool.t('bestReturn.pastQuarterTitle')}:
          </h3>
          {bestPastQuarters.map((bestPastQuarter) => (
            <TraderProfileCard
              key={bestPastQuarter}
              className={cardClass}
              profile={traderProfileDict[bestPastQuarter]}
              onClick={handleClickCard}
            />
          ))}
        </div>
      )}
      {!!bestPastMonths.length && (
        <div
          data-testid='card'
          className={sectionClass}
        >
          <h3 className={titleClass}>
            {localeTool.t('bestReturn.pastMonthTitle')}:
          </h3>
          {bestPastMonths.map((bestPastMonth) => (
            <TraderProfileCard
              key={bestPastMonth}
              className={cardClass}
              profile={traderProfileDict[bestPastMonth]}
              onClick={handleClickCard}
            />
          ))}
        </div>
      )}
      {!!bestPastWeeks.length && (
        <div
          data-testid='card'
          className={sectionClass}
        >
          <h3 className={titleClass}>
            {localeTool.t('bestReturn.pastWeekTitle')}:
          </h3>
          {bestPastWeeks.map((bestPastWeek) => (
            <TraderProfileCard
              key={bestPastWeek}
              className={cardClass}
              profile={traderProfileDict[bestPastWeek]}
              onClick={handleClickCard}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default EachTops
