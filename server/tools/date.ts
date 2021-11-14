import moment from 'moment'

const DATE_FORMAT = 'yyyy-MM-DD'
const INITIAL_DATE = '2001-01-01'

const YEAR_FORMAT = 'yyyy'
const INITIAL_YEAR = '2000'

export const getInitialDate = (): string => {
  return INITIAL_DATE
}

export const getInitialYear = (): string => {
  return INITIAL_YEAR
}

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT)
}

export const getCurrentYear = (): string => {
  return moment().format(YEAR_FORMAT)
}

export const getPreviousDate = (
  date: string,
  differ: number = 1
): string => {
  const type = differ === 1 ? 'day' : 'days'
  return moment(date).subtract(differ, type).format(DATE_FORMAT)
}

export const getNextDate = (
  date: string,
  differ: number = 1
): string => {
  const type = differ === 1 ? 'day' : 'days'
  return moment(date).add(differ, type).format(DATE_FORMAT)
}

export const getNextYear = (
  year: string,
  differ: number = 1
): string => {
  const type = differ === 1 ? 'year': 'years'
  return moment(year).add(differ, type).format(YEAR_FORMAT)
}

export const getDaysInRange = (
  startDate: string, endDate: string
): string[] => {
  const days = []
  for (let date = startDate; date <= endDate; date = getNextDate(date)) {
    days.push(date)
  }
  return days
}

export const getYearsInRange = (
  startYear: string, endYear: string
): string[] => {
  const years = []
  for (let year = startYear; year <= endYear; year = getNextYear(year)) {
    years.push(year)
  }
  return years
}

export const getDayNumber = (date: string): number => {
  return moment(date).isoWeekday()
}
