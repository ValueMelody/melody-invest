import moment from 'moment'
import * as constants from '@shared/constants'

const DATE_FORMAT = 'yyyy-MM-DD'
const QUARTER_FORMAT = 'yyyy-MM'
const YEAR_FORMAT = 'yyyy'

const INITIAL_DATE = constants.trader.initial.DATE
const INITIAL_MONTH = '2000-01'
const INITIAL_QUARTER = '2000-03'
const INITIAL_YEAR = '2000'

export const getInitialDate = (): string => {
  return INITIAL_DATE
}

export const getInitialYear = (): string => {
  return INITIAL_YEAR
}

export const getInitialQuarter = (): string => {
  return INITIAL_QUARTER
}

export const getInitialMonth = (): string => {
  return INITIAL_MONTH
}

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT)
}

export const getCurrentYear = (): string => {
  return moment().format(YEAR_FORMAT)
}

export const getCurrentQuater = (): string => {
  const currentDate = moment().format(QUARTER_FORMAT)
  return getQuarterByDate(currentDate)
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

export const getPreviousDate = (
  date: string,
  differ: number = 1,
): string => {
  const type = differ === 1 ? 'day' : 'days'
  return moment(date).subtract(differ, type).format(DATE_FORMAT)
}

export const getNextDate = (
  date: string,
  differ: number = 1,
): string => {
  return moment(date)
    .add(differ, 'days')
    .format(DATE_FORMAT)
}

export const getPreviousYear = (
  year: string,
  differ: number = 1,
): string => {
  return moment(year)
    .subtract(differ, 'years')
    .format(YEAR_FORMAT)
}

export const getNextYear = (
  year: string,
  differ: number = 1,
): string => {
  return moment(year)
    .add(differ, 'years')
    .format(YEAR_FORMAT)
}

export const getPreviousQuarter = (
  quarter: string,
  differ: number = 1,
): string => {
  return moment(quarter)
    .subtract(differ, 'quarters')
    .format(QUARTER_FORMAT)
}

export const getNextQuarter = (
  quarter: string,
  differ: number = 1,
): string => {
  return moment(quarter)
    .add(differ, 'quarters')
    .format(QUARTER_FORMAT)
}

export const getDaysInRange = (
  startDate: string, endDate: string,
): string[] => {
  const days = []
  for (let date = startDate; date <= endDate; date = getNextDate(date)) {
    days.push(date)
  }
  return days
}

export const getYearsInRange = (
  startYear: string, endYear: string,
): string[] => {
  const years = []
  for (let year = startYear; year <= endYear; year = getNextYear(year)) {
    years.push(year)
  }
  return years
}

export const getQuartersInRange = (
  startQuarter: string, endQuarter: string,
): string[] => {
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
  const end = moment(endDate)
  const start = moment(startDate)
  const differ = moment.duration(end.diff(start)).asDays()
  return Math.floor(differ)
}

export const getAdjustedQuarter = (
  quarter: string, differ: number | null,
) => {
  if (differ === null || !quarter) return quarter
  const [year, month] = quarter.split('-')
  const yearNum = parseInt(year)
  const monthNum = parseInt(month)

  let adjustedYear = yearNum
  let adjustedMonth = monthNum + differ

  if (monthNum + differ > 12) {
    adjustedMonth = monthNum + differ - 12
    adjustedYear = yearNum + 1
  }

  if (monthNum + differ < 1) {
    adjustedMonth = monthNum + differ + 12
    adjustedYear = yearNum - 1
  }

  const paddingLeft = adjustedMonth < 10 ? '0' : ''
  return `${adjustedYear}-${paddingLeft}${adjustedMonth}`
}
