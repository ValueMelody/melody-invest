import * as interfaces from '@shared/interfaces'
import * as tickerCategory from './tickerCategory'
import { instance, mock, when } from 'ts-mockito'

const type = mock<AppState>({})

const categoryType = mock<interfaces.tickerCategoryModel.Record>({})
const category1 = instance(categoryType)
const category2 = instance(categoryType)
const category3 = instance(categoryType)
when(type.tickerCategory).thenReturn({
  base: {
    1: category1,
    2: category2,
    3: category3,
  },
})
const stateInstance = instance(type)

describe('#selectTickerCategoryBases', () => {
  test('could select ticker category bases', () => {
    expect(tickerCategory.selectTickerCategoryBases()(stateInstance)).toStrictEqual([category1, category2, category3])
  })
})
