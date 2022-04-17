import moment from 'moment'
import * as constants from '@shared/constants'

const DATE_FORMAT = 'yyyy-MM-DD'
const QUARTER_FORMAT = 'yyyy-MM'
const YEAR_FORMAT = 'yyyy'

export const getInitialDate = (): string => {
  return constants.trader.initial.DATE
}

export const getInitialYear = (): string => {
  return constants.trader.initial.DATE.substring(0, 4)
}

export const getInitialQuarter = (): string => {
  return `${constants.trader.initial.DATE.substring(0, 4)}-03`
}

export const getInitialMonth = (): string => {
  return constants.trader.initial.DATE.substring(0, 7)
}

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT)
}

export const getCurrentYear = (): string => {
  return moment().format(YEAR_FORMAT)
}

export const getYearByDate = (date: string): string => {
  return date.substring(0, 4)
}

export const getQuarterByDate = (date: string): string => {
  const currentDate = date.substring(0, 7)
  const [currentYear, currentMonth] = currentDate.split('-')
  const month = parseInt(currentMonth)
  const year = parseInt(currentYear)
  let quarter = ''
  if (month <= 3) {
    quarter = '03'
  } else if (month <= 6) {
    quarter = '06'
  } else if (month <= 9) {
    quarter = '09'
  } else if (month <= 12) {
    quarter = '12'
  }
  return `${year}-${quarter}`
}

export const getCurrentQuater = (): string => {
  const currentDate = moment().format(QUARTER_FORMAT)
  return getQuarterByDate(currentDate)
}

export const getPreviousDate = (
  date: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(date).subtract(differ, 'days').format(DATE_FORMAT)
}

export const getNextDate = (
  date: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(date).add(differ, 'days').format(DATE_FORMAT)
}

export const getPreviousYear = (
  year: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(year)
    .subtract(differ, 'years')
    .format(YEAR_FORMAT)
}

export const getNextYear = (
  year: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(year)
    .add(differ, 'years')
    .format(YEAR_FORMAT)
}

export const getPreviousQuarter = (
  quarter: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(quarter)
    .subtract(differ, 'quarters')
    .format(QUARTER_FORMAT)
}

export const getNextQuarter = (
  quarter: string,
  differ: number = 1,
): string => {
  if (differ <= 0) throw new Error('differ must larger than 0')
  return moment(quarter)
    .add(differ, 'quarters')
    .format(QUARTER_FORMAT)
}

export const getDaysInRange = (
  startDate: string, endDate: string,
): string[] => {
  if (startDate >= endDate) throw new Error('startDate must earlier than endDate')
  const days = []
  for (let date = startDate; date <= endDate; date = getNextDate(date)) {
    days.push(date)
  }
  return days
}

export const getYearsInRange = (
  startYear: string, endYear: string,
): string[] => {
  if (startYear >= endYear) throw new Error('startYear must earlier than endYear')
  const years = []
  for (let year = startYear; year <= endYear; year = getNextYear(year)) {
    years.push(year)
  }
  return years
}

export const getQuartersInRange = (
  startQuarter: string, endQuarter: string,
): string[] => {
  if (startQuarter >= endQuarter) throw new Error('startQuarter must earlier than endQuarter')
  const quarters = []
  for (let quarter = startQuarter; quarter <= endQuarter; quarter = getNextQuarter(quarter)) {
    quarters.push(quarter)
  }
  return quarters
}

export const getDayNumber = (date: string): number => {
  return moment(date).isoWeekday()
}

export const getDurationCount = (startDate: string, endDate: string): number => {
  if (startDate >= endDate) throw new Error('startDate must earlier than endDate')
  const end = moment(endDate)
  const start = moment(startDate)
  const differ = moment.duration(end.diff(start)).asDays()
  return Math.floor(differ)
}

export const isNearbyQuarter = (
  fiscalDate: string,
  quarter: string,
): boolean => {
  const fiscalQuarter = fiscalDate.substring(0, 7)
  const [fiscalYear, fiscalMonth] = fiscalQuarter.split('-')
  const [year, month] = quarter.split('-')
  if (fiscalMonth === '01' && month === '12') {
    return parseInt(year) + 1 === parseInt(fiscalYear)
  }

  if (year !== fiscalYear) return false
  if (month === fiscalMonth) return true
  if (parseInt(month) + 1 === parseInt(fiscalMonth)) return true
  if (parseInt(month) - 1 === parseInt(fiscalMonth)) return true
  return false
}
