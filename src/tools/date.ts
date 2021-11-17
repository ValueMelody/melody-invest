import moment from 'moment'

const DATE_FORMAT = 'yyyy-MM-DD'
const QUARTER_FORMAT = 'yyyy-MM'
const YEAR_FORMAT = 'yyyy'

const INITIAL_DATE = '2001-01-01'
const INITIAL_MONTH = '2000-01'
const INITIAL_QUARTER = '2000-02'
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
  const [currentYear, currentMonth] = currentDate.split('-')
  const month = parseInt(currentMonth)
  let year = parseInt(currentYear)
  let quarter = ''
  if (month <= 3) {
    quarter = '12'
    year -= 1
  } else if (month <= 6) {
    quarter = '03'
  } else if (month <= 9) {
    quarter = '06'
  } else if (month <= 12) {
    quarter = '09'
  }
  return `${year}-${quarter}`
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
  return moment(date)
    .add(differ, 'days')
    .format(DATE_FORMAT)
}

export const getNextYear = (
  year: string,
  differ: number = 1
): string => {
  return moment(year)
    .add(differ, 'years')
    .format(YEAR_FORMAT)
}

export const getNextQuarter = (
  quarter: string,
  differ: number = 1
): string => {
  return moment(quarter)
    .add(differ, 'quarters')
    .format(QUARTER_FORMAT)
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

export const getQuartersInRange = (
  startQuarter: string, endQuarter: string
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

export const getAdjustedQuarter = (
  quarter: string, differ: string | null
) => {
  if (!differ) return quarter
  const [year, month] = quarter.split('-')
  const yearNum = parseInt(year)
  const monthNum = parseInt(month)
  const differNum = parseInt(differ)

  const isNextYear = monthNum === 12 && differNum > 0
  const adjustedMonth = isNextYear ? differNum : monthNum + differNum
  const adjustedYear = isNextYear ? yearNum + 1 : yearNum
  const paddingLeft = adjustedMonth < 10 ? '0' : ''
  return `${adjustedYear}-${paddingLeft}${adjustedMonth}`
}
