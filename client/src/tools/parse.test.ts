import * as localeTool from './locale'
import * as parseTool from './parse'

describe('#dbPercentNumber', () => {
  test('could parse db percent number to percent', () => {
    expect(parseTool.dbPercentNumber(null)).toBe('')
    expect(parseTool.dbPercentNumber(10000)).toBe('100%')
    expect(parseTool.dbPercentNumber(5000)).toBe('50%')
    expect(parseTool.dbPercentNumber(0)).toBe('0%')
  })
})

describe('#dbPercent', () => {
  test('could parse db percent to percent', () => {
    expect(parseTool.dbPercent(null)).toBe('')
    expect(parseTool.dbPercent(100)).toBe('100%')
    expect(parseTool.dbPercent(50)).toBe('50%')
    expect(parseTool.dbPercent(0)).toBe('0%')
  })
})

describe('#behaviorValue', () => {
  test('could parse behavior value', () => {
    expect(parseTool.behaviorValue('priceDailyIncreaseBuy', null)).toBe('')
    expect(parseTool.behaviorValue('tickerMinPercent', 0)).toBe('0%')
    expect(parseTool.behaviorValue('tickerMaxPercent', 10)).toBe('10%')
    expect(parseTool.behaviorValue('tickerMaxPercent', 50)).toBe('50%')
    expect(parseTool.behaviorValue('tradeFrequency', null)).toBe('')
    expect(parseTool.behaviorValue('tradeFrequency', 0)).toBe(localeTool.t('behavior.frequency.never'))
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
})

describe('#behaviorTitle', () => {
  test('could parse behavior title', () => {
    expect(parseTool.behaviorTitle('tickerMaxPercent')).toBe(localeTool.t('behaviorTitle.tickerMaxPercent'))
    expect(parseTool.behaviorTitle('tradeFrequency')).toBe(localeTool.t('behaviorTitle.tradeFrequency'))
    expect(parseTool.behaviorTitle('buyPreference')).toBe(localeTool.t('behaviorTitle.buyPreference'))
    expect(parseTool.behaviorTitle('priceYearlyDecreaseSell'))
      .toBe(localeTool.t('behaviorTitle.priceYearlyDecreaseSell'))
  })
})

describe('#tickerCategoryName', () => {
  test('could parse category name', () => {
    expect(parseTool.tickerCategoryName({ id: 1, name: 'tickerCategory.tech' }))
      .toBe(localeTool.t('tickerCategory.tech'))
    expect(parseTool.tickerCategoryName({ id: 1, name: 'tickerCategory.utility' }))
      .toBe(localeTool.t('tickerCategory.utility'))
  })
})

describe('#behaviorDesc', () => {
  test('could parse behavior desc', () => {
    expect(parseTool.behaviorDesc('tickerMaxPercent')).toBe(localeTool.t('behaviorDesc.tickerMaxPercent'))
    expect(parseTool.behaviorDesc('tradeFrequency')).toBe(localeTool.t('behaviorDesc.tradeFrequency'))
    expect(parseTool.behaviorDesc('buyPreference')).toBe(localeTool.t('behaviorDesc.buyPreference'))
    expect(parseTool.behaviorDesc('priceYearlyDecreaseSell')).toBe(localeTool.t('behaviorDesc.priceYearlyDecreaseSell'))
  })
})

describe('#traderEnvName', () => {
  test('could parse trader env name', () => {
    expect(parseTool.traderEnvName({
      id: 1,
      entityId: 1,
      isSystem: true,
      name: 'traderEnv.default',
      activeTotal: 100,
      startDate: '2000-01-01',
      tickerIds: null,
    })).toBe(localeTool.t('traderEnv.default'))
    expect(parseTool.traderEnvName({
      id: 1, entityId: 1, isSystem: true, name: '', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
    })).toBe('')
    expect(parseTool.traderEnvName({
      id: 1, entityId: 1, isSystem: false, name: 'test1', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
    })).toBe('test1')
    expect(parseTool.traderEnvName({
      id: 1, entityId: 1, isSystem: false, name: 'test2', activeTotal: 100, startDate: '2000-01-01', tickerIds: null,
    })).toBe('test2')
  })
})

describe('#traderEnvStartDate', () => {
  test('could parse trader env start date', () => {
    expect(parseTool.traderEnvStartDate({
      id: 1,
      entityId: 1,
      isSystem: true,
      name: 'traderEnv.default',
      activeTotal: 100,
      startDate: '2000-01-01',
      tickerIds: null,
    })).toBe(localeTool.t('traderEnv.startAt', { date: '2000-01-01' }))
    expect(parseTool.traderEnvStartDate({
      id: 1,
      entityId: 1,
      isSystem: true,
      name: 'traderEnv.default',
      activeTotal: 100,
      startDate: '2002-02-02',
      tickerIds: null,
    })).toBe(localeTool.t('traderEnv.startAt', { date: '2002-02-02' }))
  })
})

describe('#traderEnvTickers', () => {
  test('could parse trader env start date', () => {
    expect(parseTool.traderEnvTickers({
      id: 1,
      entityId: 1,
      isSystem: true,
      name: 'traderEnv.default',
      activeTotal: 100,
      startDate: '2000-01-01',
      tickerIds: null,
    })).toBe(localeTool.t('traderEnv.allTickers'))
    expect(parseTool.traderEnvTickers({
      id: 1,
      entityId: 1,
      isSystem: true,
      name: 'traderEnv.default',
      activeTotal: 100,
      startDate: '2002-02-02',
      tickerIds: [111],
    })).toBe(localeTool.t('traderEnv.selectedTickers', { num: 1 }))
    expect(parseTool.traderEnvTickers({
      id: 1,
      entityId: 1,
      isSystem: false,
      name: 'default',
      activeTotal: 100,
      startDate: '2002-02-02',
      tickerIds: [1, 2, 3, 4, 5],
    })).toBe(localeTool.t('traderEnv.selectedTickers', { num: 5 }))
  })
})

describe('#profileName', () => {
  test('could parse profile name', () => {
    expect(parseTool.profileName(1)).toBe(`${localeTool.t('entity.profile')} #1`)
    expect(parseTool.profileName(2)).toBe(`${localeTool.t('entity.profile')} #2`)
  })
})

describe('#traderComboTraders', () => {
  test('could parse trader combo selected traders', () => {
    expect(parseTool.traderComboTraders({
      id: 1, entityId: 1, isSystem: true, name: 'systemCombo.-1', traderIds: [],
    })).toBe(localeTool.t('traderCombo.selectedTraders', { num: 0 }))
    expect(parseTool.traderComboTraders({
      id: 1, entityId: 1, isSystem: true, name: 'systemCombo.-1', traderIds: [1, 2],
    })).toBe(localeTool.t('traderCombo.selectedTraders', { num: 2 }))
  })
})

describe('#holdingValue', () => {
  test('could parse holding value', () => {
    expect(parseTool.holdingValue(null)).toBe(null)
    expect(parseTool.holdingValue(100)).toBe('$1.00')
    expect(parseTool.holdingValue(1010)).toBe('$10.10')
    expect(parseTool.holdingValue(1111)).toBe('$11.11')
    expect(parseTool.holdingValue(1000000)).toBe('$10,000.00')
    expect(parseTool.holdingValue(100000000)).toBe('$1,000,000.00')
    // @ts-ignore
    Intl = null // eslint-disable-line no-global-assign
    expect(parseTool.holdingValue(100000000)).toBe('1000000.00')
  })
})

describe('#floatToPercent', () => {
  test('could parse float to percent', () => {
    expect(parseTool.floatToPercent(0.11)).toBe('11.00%')
    expect(parseTool.floatToPercent(0.1122)).toBe('11.22%')
    expect(parseTool.floatToPercent(0.112233)).toBe('11.22%')
    expect(parseTool.floatToPercent(0.112253)).toBe('11.23%')
  })
})

describe('#chartTrends', () => {
  test('could parse chart trends', () => {
    expect(parseTool.chartTrends([1, 2, 3], null)).toStrictEqual([])
    expect(parseTool.chartTrends(null, 100)).toStrictEqual([])
    expect(parseTool.chartTrends([], 100)).toStrictEqual([])
    expect(parseTool.chartTrends([1, 2, 3], 4)).toStrictEqual([
      { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 },
    ])
    expect(parseTool.chartTrends([3, 2, 1], 4)).toStrictEqual([
      { label: '1', value: 3 }, { label: '2', value: 2 }, { label: '3', value: 1 }, { label: '4', value: 4 },
    ])
  })
})
