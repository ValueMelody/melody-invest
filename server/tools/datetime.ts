import moment from 'moment'

const DATE_FORMAT = 'yyyy-MM-DD'
const INITIAL_DATE = '2000-01-01'

export const getInitialDate = (): string => {
  return INITIAL_DATE
}

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT)
}

export const getNextDate = (date: string): string => {
  return moment(date).add(1, 'day').format(DATE_FORMAT)
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
