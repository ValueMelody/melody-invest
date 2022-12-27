import * as adapterEnum from 'enums/adapter'
import * as dateTool from 'tools/date'
import * as emailAdapter from 'adapters/email'
import * as marketEnum from 'enums/market'
import * as syncIndicators from 'services/syncIndicators'
import * as syncTickers from 'services/syncTickers'

const validateDateParam = (date: string) => {
  if (!date || date.length !== 10) throw new Error('no date or wrong date provided')
}

const validateQuarterParam = (date: string) => {
  if (!date || date.length !== 7) throw new Error('no quarter or wrong quarter provided')
}

export const syncTickerPrices = async () => {
  console.info('Start sync ticker prices')
  try {
    const date = process.argv[3] || dateTool.getCurrentDate()
    validateDateParam(date)
    const notes = await syncTickers.syncAllPrices(date)

    const noteTags = notes.map((note) => `<li>${note}</li>`)

    const transporter = emailAdapter.initTransporter()
    await transporter.sendMail({
      from: `ValueMelody ${adapterEnum.MailerConfig.Email}`,
      to: 'valuemelody@outlook.com',
      subject: 'Ticker prices synced',
      html: noteTags.length ? `<ul>${noteTags.join('')}</ul>` : '',
    })

    console.info('ticker prices synced')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const syncTickerEarnings = async () => {
  const quarter = process.argv[3] || dateTool.getCurrentQuater()
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  const startTickerId = process.argv[5] ? parseInt(process.argv[5]) : null
  await syncTickers.syncAllEarnings(quarter, forceRecheck, startTickerId)
}

export const syncTickerIncomes = async () => {
  const quarter = process.argv[3] || dateTool.getCurrentQuater()
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  const startTickerId = process.argv[5] ? parseInt(process.argv[5]) : null
  await syncTickers.syncAllIncomes(quarter, forceRecheck, startTickerId)
}

export const syncMonthlyIndicators = async () => {
  await syncIndicators.syncAllMonthlyIndicators()
}

export const syncQuarterlyIndicators = async () => {
  await syncIndicators.syncQuarterly(marketEnum.Type.GDP)
}

export const syncYearlyIndicators = async () => {
  await syncIndicators.syncAllYearlyIndicators()
}
