import moment from 'moment'

const DATE_FORMAT = 'yyyy-MM-DD'
const INITIAL_DATE = '2001-01-01'

export const getInitialDate = (): string => {
  return INITIAL_DATE
}

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT)
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

export const getDaysInRange = (
  startDate: string, endDate: string
): string[] => {
  const days = []
  for (let date = startDate; date <= endDate; date = getNextDate(date)) {
    days.push(date)
  }
  return days
}

export const getDayNumber = (date: string): number => {
  return moment(date).isoWeekday()
}
