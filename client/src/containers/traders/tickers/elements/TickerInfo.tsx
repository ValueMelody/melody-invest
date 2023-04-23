import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import TickerLabel from 'containers/traders/elements/TickerLabel'

const TickerInfo = ({
  ticker,
}: {
  ticker: interfaces.tickerModel.Record;
}) => {
  const priceRangeText = ticker.firstPriceDate || ticker.lastPriceDate
    ? localeTool.t('ticker.dailyPriceRange', { start: ticker.firstPriceDate, end: ticker.lastPriceDate })
    : localeTool.t('ticker.emptyDailyPriceRange')

  const hasQuarterlyData = ticker.firstEPSQuarter || ticker.firstIncomeQuarter ||
    ticker.lastEPSQuarter || ticker.lastIncomeQuarter
  const quarterlyFinancialRangeText = hasQuarterlyData
    ? localeTool.t('ticker.quarterlyFinancialRange', {
      start: ticker.firstEPSQuarter || ticker.firstIncomeQuarter,
      end: ticker.lastEPSQuarter || ticker.lastIncomeQuarter,
    })
    : localeTool.t('ticker.emptyQuarterlyFinancialRange')

  const hasYearlyData = ticker.firstEPSYear || ticker.firstIncomeYear || ticker.lastEPSYear || ticker.lastIncomeYear
  const yearlyFinancialRangeText = hasYearlyData
    ? localeTool.t('ticker.yearlyFinancialRange', {
      start: ticker.firstEPSYear || ticker.firstIncomeYear,
      end: ticker.lastEPSYear || ticker.lastIncomeYear,
    })
    : localeTool.t('ticker.emptyYearlyFinancialRange')

  return (
    <section
      className='flex flex-col m-8'
    >
      <header className='flex items-center'>
        <TickerLabel
          className='mx-2 my-1'
          color='gray'
          ticker={ticker}
        />
        {ticker.isDelisted && (
          <p>
            {localeTool.t('ticker.delisted')}
          </p>
        )}
      </header>
      <p className='mt-2 italic'>
        {priceRangeText}
      </p>
      <p className='mt-2 italic'>
        {quarterlyFinancialRangeText}
      </p>
      <p className='mt-2 italic'>
        {yearlyFinancialRangeText}
      </p>
    </section>
  )
}

export default TickerInfo
