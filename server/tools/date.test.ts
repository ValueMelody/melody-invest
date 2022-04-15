import * as date from './date'

test('could get initial date', async () => {
  expect(date.getInitialDate()).toEqual('2001-01-01')
})

test('could get initial year', async () => {
  expect(date.getInitialYear()).toEqual('2001')
})

test('could get initial quarter', async () => {
  expect(date.getInitialQuarter()).toEqual('2001-03')
})

test('could get initial month', async () => {
  expect(date.getInitialMonth()).toEqual('2001-01')
})

test('could get current date', async () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString()
  const parsedMonth = month.length === 1 ? `0${month}` : month
  const day = today.getDate()
  expect(date.getCurrentDate()).toEqual(`${year}-${parsedMonth}-${day}`)
})

test('could get current year', async () => {
  const today = new Date()
  expect(date.getCurrentYear()).toEqual(today.getFullYear().toString())
})

test('could get year by date', async () => {
  expect(date.getYearByDate('1999-01-01')).toEqual('1999')
  expect(date.getYearByDate('2000-01-01')).toEqual('2000')
})

test('could get quarter by date', async () => {
  expect(date.getQuarterByDate('1999-01-01')).toEqual('1999-03')
  expect(date.getQuarterByDate('2000-03-31')).toEqual('2000-03')
  expect(date.getQuarterByDate('2000-04-01')).toEqual('2000-06')
  expect(date.getQuarterByDate('2001-06-30')).toEqual('2001-06')
  expect(date.getQuarterByDate('2001-07-01')).toEqual('2001-09')
  expect(date.getQuarterByDate('2001-09-30')).toEqual('2001-09')
  expect(date.getQuarterByDate('2002-10-01')).toEqual('2002-12')
  expect(date.getQuarterByDate('2002-12-31')).toEqual('2002-12')
})

test('could get current quarter', async () => {
  const today = date.getCurrentDate()
  const [year, month] = today.split('-').map((value) => parseInt(value))
  let quarter = null
  if (month <= 3) {
    quarter = '03'
  } else if (month <= 6) {
    quarter = '06'
  } else if (month <= 9) {
    quarter = '09'
  } else {
    quarter = '12'
  }
  expect(date.getCurrentQuater()).toEqual(`${year}-${quarter}`)
})

test('could get previous date', async () => {
  expect(date.getPreviousDate('2000-01-01')).toEqual('1999-12-31')
  expect(date.getPreviousDate('2001-01-05', 2)).toEqual('2001-01-03')
  expect(date.getPreviousDate('2001-01-05', 3)).toEqual('2001-01-02')
  expect(date.getPreviousDate('2001-02-05', 5)).toEqual('2001-01-31')
  expect(date.getPreviousDate('2001-05-05', 5)).toEqual('2001-04-30')
  expect(() => date.getPreviousDate('2000-01-01', -1)).toThrowError()
})

test('could get next date', async () => {
  expect(date.getNextDate('1999-12-31')).toEqual('2000-01-01')
  expect(date.getNextDate('2001-01-01', 2)).toEqual('2001-01-03')
  expect(date.getNextDate('2001-01-01', 3)).toEqual('2001-01-04')
  expect(date.getNextDate('2001-01-31', 5)).toEqual('2001-02-05')
  expect(date.getNextDate('2001-04-30', 5)).toEqual('2001-05-05')
  expect(() => date.getNextDate('2000-01-01', -1)).toThrowError()
})

test('could get previous year', async () => {
  expect(date.getPreviousYear('2000')).toEqual('1999')
  expect(date.getPreviousYear('2001')).toEqual('2000')
  expect(date.getPreviousYear('2001', 2)).toEqual('1999')
  expect(date.getPreviousYear('2011', 10)).toEqual('2001')
  expect(() => date.getPreviousYear('2000-01-01', -1)).toThrowError()
})

test('could get next year', async () => {
  expect(date.getNextYear('1999')).toEqual('2000')
  expect(date.getNextYear('2001')).toEqual('2002')
  expect(date.getNextYear('2001', 2)).toEqual('2003')
  expect(date.getNextYear('2001', 10)).toEqual('2011')
  expect(() => date.getNextYear('2000-01-01', -1)).toThrowError()
})

test('could get previous quarter', async () => {
  expect(date.getPreviousQuarter('2001-03')).toEqual('2000-12')
  expect(date.getPreviousQuarter('2001-06')).toEqual('2001-03')
  expect(date.getPreviousQuarter('2002-09')).toEqual('2002-06')
  expect(date.getPreviousQuarter('2002-12')).toEqual('2002-09')
  expect(date.getPreviousQuarter('2003-12')).toEqual('2003-09')
  expect(date.getPreviousQuarter('2003-12', 2)).toEqual('2003-06')
  expect(date.getPreviousQuarter('2003-12', 3)).toEqual('2003-03')
  expect(date.getPreviousQuarter('2003-12', 4)).toEqual('2002-12')
  expect(() => date.getPreviousQuarter('2000-01-01', -1)).toThrowError()
})

test('could get next quarter', async () => {
  expect(date.getNextQuarter('1999-12')).toEqual('2000-03')
  expect(date.getNextQuarter('2001-03')).toEqual('2001-06')
  expect(date.getNextQuarter('2001-06')).toEqual('2001-09')
  expect(date.getNextQuarter('2002-09')).toEqual('2002-12')
  expect(date.getNextQuarter('2002-12')).toEqual('2003-03')
  expect(date.getNextQuarter('2003-12')).toEqual('2004-03')
  expect(date.getNextQuarter('2003-12', 2)).toEqual('2004-06')
  expect(date.getNextQuarter('2003-12', 3)).toEqual('2004-09')
  expect(date.getNextQuarter('2003-12', 4)).toEqual('2004-12')
  expect(() => date.getNextQuarter('2000-01-01', -1)).toThrowError()
})

test('could get days in range', async () => {
  expect(date.getDaysInRange('2001-03-01', '2001-03-02'))
    .toEqual(['2001-03-01', '2001-03-02'])
  expect(date.getDaysInRange('2001-03-01', '2001-03-03'))
    .toEqual(['2001-03-01', '2001-03-02', '2001-03-03'])
  expect(date.getDaysInRange('2001-03-31', '2001-04-03'))
    .toEqual(['2001-03-31', '2001-04-01', '2001-04-02', '2001-04-03'])
  expect(() => date.getDaysInRange('2000-01-02', '2000-01-01')).toThrowError()
})

test('could get years in range', async () => {
  expect(date.getYearsInRange('2001', '2002')).toEqual(['2001', '2002'])
  expect(date.getYearsInRange('2001', '2003')).toEqual(['2001', '2002', '2003'])
  expect(date.getYearsInRange('1999', '2002')).toEqual(['1999', '2000', '2001', '2002'])
  expect(() => date.getDaysInRange('2001', '2000')).toThrowError()
})

test('could get quarters in range', async () => {
  expect(date.getQuartersInRange('2001-03', '2001-06'))
    .toEqual(['2001-03', '2001-06'])
  expect(date.getQuartersInRange('2001-03', '2001-09'))
    .toEqual(['2001-03', '2001-06', '2001-09'])
  expect(date.getQuartersInRange('2001-03', '2001-12'))
    .toEqual(['2001-03', '2001-06', '2001-09', '2001-12'])
  expect(date.getQuartersInRange('2001-03', '2002-03'))
    .toEqual(['2001-03', '2001-06', '2001-09', '2001-12', '2002-03'])
  expect(() => date.getQuartersInRange('2000-06', '2000-03')).toThrowError()
})

test('could get day number', async () => {
  expect(date.getDayNumber('2022-01-31')).toEqual(1)
  expect(date.getDayNumber('2022-02-01')).toEqual(2)
  expect(date.getDayNumber('2022-02-02')).toEqual(3)
  expect(date.getDayNumber('2022-02-03')).toEqual(4)
  expect(date.getDayNumber('2022-02-04')).toEqual(5)
  expect(date.getDayNumber('2022-02-05')).toEqual(6)
  expect(date.getDayNumber('2022-02-06')).toEqual(7)
  expect(date.getDayNumber('2022-02-07')).toEqual(1)
})

test('could get duration count', async () => {
  expect(date.getDurationCount('2022-01-31', '2022-02-01')).toEqual(1)
  expect(date.getDurationCount('2022-01-31', '2022-02-02')).toEqual(2)
  expect(date.getDurationCount('2022-01-31', '2022-02-11')).toEqual(11)
  expect(date.getDurationCount('2022-01-31', '2022-03-01')).toEqual(29)
  expect(() => date.getQuartersInRange('2000-06-02', '2000-06-01')).toThrowError()
})
