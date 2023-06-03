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

  const yearlyFinancialRangeText = ticker.firstFinancialYear || ticker.lastFinancialYear
    ? localeTool.t('ticker.yearlyFinancialRange', { start: ticker.firstFinancialYear, end: ticker.lastFinancialYear })
    : localeTool.t('ticker.emptyYearlyFinancialRange')

  const QuarterlyFinancialRangeText = ticker.firstFinancialQuarter || ticker.lastFinancialQuarter
    ? localeTool.t('ticker.quarterlyFinancialRange', {
      start: ticker.firstFinancialQuarter,
      end: ticker.lastFinancialQuarter,
    })
    : localeTool.t('ticker.emptyQuarterlyFinancialRange')

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
        {yearlyFinancialRangeText}
      </p>
      <p className='mt-2 italic'>
        {QuarterlyFinancialRangeText}
      </p>
    </section>
  )
}

export default TickerInfo
