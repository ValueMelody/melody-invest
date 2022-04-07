import * as parseTool from './parse'
import * as localeTool from './locale'

test('could parse db percent number to percent', () => {
  expect(parseTool.dbPercentNumber(null)).toBe('')
  expect(parseTool.dbPercentNumber(10000)).toBe('100%')
  expect(parseTool.dbPercentNumber(5000)).toBe('50%')
  expect(parseTool.dbPercentNumber(0)).toBe('0%')
})

test('could parse db percent to percent', () => {
  expect(parseTool.dbPercent(null)).toBe('')
  expect(parseTool.dbPercent(100)).toBe('100%')
  expect(parseTool.dbPercent(50)).toBe('50%')
  expect(parseTool.dbPercent(0)).toBe('0%')
})

test('could parse behavior value', () => {
  expect(parseTool.behaviorValue('priceDailyIncreaseBuy', null)).toBe('')
  expect(parseTool.behaviorValue('tickerMinPercent', 0)).toBe('0%')
  expect(parseTool.behaviorValue('tickerMaxPercent', 10)).toBe('10%')
  expect(parseTool.behaviorValue('tickerMaxPercent', 50)).toBe('50%')
  expect(parseTool.behaviorValue('tradeFrequency', null)).toBe('')
  expect(parseTool.behaviorValue('tradeFrequency', 0)).toBe(localeTool.t('common.never'))
  expect(parseTool.behaviorValue('rebalanceFrequency', 10)).toBe(localeTool.t('behavior.frequency.type', { num: 10 }))
  expect(parseTool.behaviorValue('rebalanceFrequency', 50)).toBe(localeTool.t('behavior.frequency.type', { num: 50 }))
  expect(parseTool.behaviorValue('buyPreference', null)).toBe('')
  expect(parseTool.behaviorValue('buyPreference', 0)).toBe('')
  expect(parseTool.behaviorValue('buyPreference', 1)).toBe(localeTool.t('behavior.preference.type.1'))
  expect(parseTool.behaviorValue('sellPreference', 22)).toBe(localeTool.t('behavior.preference.type.22'))
  expect(parseTool.behaviorValue('sellPreference', 23)).toBe('')
  expect(parseTool.behaviorValue('priceYearlyDecreaseSell', null)).toBe('')
  expect(parseTool.behaviorValue('priceYearlyDecreaseSell', 1)).toBe(1)
  expect(parseTool.behaviorValue('priceYearlyDecreaseSell', 10)).toBe(10)
})

test('could parse behavior title', () => {
  expect(parseTool.behaviorTitle('tickerMaxPercent')).toBe(localeTool.t('behaviorTitle.tickerMaxPercent'))
  expect(parseTool.behaviorTitle('tradeFrequency')).toBe(localeTool.t('behaviorTitle.tradeFrequency'))
  expect(parseTool.behaviorTitle('buyPreference')).toBe(localeTool.t('behaviorTitle.buyPreference'))
  expect(parseTool.behaviorTitle('priceYearlyDecreaseSell')).toBe(localeTool.t('behaviorTitle.priceYearlyDecreaseSell'))
})

test('could parse behavior desc', () => {
  expect(parseTool.behaviorDesc('tickerMaxPercent')).toBe(localeTool.t('behaviorDesc.tickerMaxPercent'))
  expect(parseTool.behaviorDesc('tradeFrequency')).toBe(localeTool.t('behaviorDesc.tradeFrequency'))
  expect(parseTool.behaviorDesc('buyPreference')).toBe(localeTool.t('behaviorDesc.buyPreference'))
  expect(parseTool.behaviorDesc('priceYearlyDecreaseSell')).toBe(localeTool.t('behaviorDesc.priceYearlyDecreaseSell'))
})

test('could parse trader env name', () => {
  expect(parseTool.traderEnvName({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe(localeTool.t('traderEnv.default'))
  expect(parseTool.traderEnvName({
    id: 1, isSystem: true, name: '', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('')
  expect(parseTool.traderEnvName({
    id: 1, isSystem: false, name: 'test1', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('test1')
  expect(parseTool.traderEnvName({
    id: 1, isSystem: false, name: 'test2', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('test2')
})

test('could parse trader env name', () => {
  expect(parseTool.traderEnvName({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe(localeTool.t('traderEnv.default'))
  expect(parseTool.traderEnvName({
    id: 1, isSystem: true, name: '', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('')
  expect(parseTool.traderEnvName({
    id: 1, isSystem: false, name: 'test1', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('test1')
  expect(parseTool.traderEnvName({
    id: 1, isSystem: false, name: 'test2', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe('test2')
})

test('could parse trader env start date', () => {
  expect(parseTool.traderEnvStartDate({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe(localeTool.t('traderEnv.startAt', { date: '2000-01-01' }))
  expect(parseTool.traderEnvStartDate({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2002-02-02', tickerIds: null,
  })).toBe(localeTool.t('traderEnv.startAt', { date: '2002-02-02' }))
})

test('could parse trader env start date', () => {
  expect(parseTool.traderEnvTickers({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
  })).toBe(localeTool.t('traderEnv.allTickers'))
  expect(parseTool.traderEnvTickers({
    id: 1, isSystem: true, name: 'traderEnv.default', activeTotal: 100, startDate: '2002-02-02', tickerIds: [111],
  })).toBe(localeTool.t('traderEnv.selectedTickers', { num: 1 }))
  expect(parseTool.traderEnvTickers({
    id: 1, isSystem: false, name: 'default', activeTotal: 100, startDate: '2002-02-02', tickerIds: [1, 2, 3, 4, 5],
  })).toBe(localeTool.t('traderEnv.selectedTickers', { num: 5 }))
})

test('could parse trader env name', () => {
  expect(parseTool.traderComboName({
    id: 1, isSysten: true, name: 'systemCombo.-1', traderEnvId: 1,
  })).toBe(localeTool.t('systemCombo.-1'))
  expect(parseTool.traderComboName({
    id: 1, isSysten: true, name: '', traderEnvId: 1,
  })).toBe('')
  expect(parseTool.traderComboName({
    id: 1, isSysten: false, name: 'test1', traderEnvId: 1,
  })).toBe('test1')
  expect(parseTool.traderComboName({
    id: 1, isSysten: false, name: 'test2', traderEnvId: 1,
  })).toBe('test2')
})

test('could parse holding value', () => {
  expect(parseTool.holdingValue(null)).toBe(null)
  expect(parseTool.holdingValue(100)).toBe('$1.00')
  expect(parseTool.holdingValue(1010)).toBe('$10.10')
  expect(parseTool.holdingValue(1111)).toBe('$11.11')
  expect(parseTool.holdingValue(1000000)).toBe('$10,000.00')
  expect(parseTool.holdingValue(100000000)).toBe('$1,000,000.00')
})

test('could parse float to percent', () => {
  expect(parseTool.floatToPercent(0.11)).toBe('11.00%')
  expect(parseTool.floatToPercent(0.1122)).toBe('11.22%')
  expect(parseTool.floatToPercent(0.112233)).toBe('11.22%')
  expect(parseTool.floatToPercent(0.112253)).toBe('11.23%')
})