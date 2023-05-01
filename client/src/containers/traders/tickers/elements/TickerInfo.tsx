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
    </section>
  )
}

export default TickerInfo
