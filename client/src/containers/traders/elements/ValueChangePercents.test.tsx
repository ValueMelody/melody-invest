import { render, screen, fireEvent } from 'test.utils'
import ValueChangePercents from './ValueChangePercents'
import * as localeTool from 'tools/locale'

describe('#ValueChangePercents', () => {
  test('could render', () => {
    const { container } = render(
      <ValueChangePercents
        yearlyPercentNumber={11111}
        pastYearPercentNumber={12222}
        pastQuarterPercentNumber={3000}
        pastMonthPercentNumber={5000}
        pastWeekPercentNumber={-1000}
      />,
    )

    const items = container.querySelectorAll('.item')
    expect(items.length).toBe(5)

    expect(items[0].children[0].innerHTML).toBe(`${localeTool.t('gain.yearly')}:`)
    expect(items[0].children[1].innerHTML).toBe('111.11%')
    expect(items[1].children[0].innerHTML).toBe(`${localeTool.t('gain.pastYear')}:`)
    expect(items[1].children[1].innerHTML).toBe('122.22%')
    expect(items[2].children[0].innerHTML).toBe(`${localeTool.t('gain.pastQuarter')}:`)
    expect(items[2].children[1].innerHTML).toBe('30%')
    expect(items[3].children[0].innerHTML).toBe(`${localeTool.t('gain.pastMonth')}:`)
    expect(items[3].children[1].innerHTML).toBe('50%')
    expect(items[4].children[0].innerHTML).toBe(`${localeTool.t('gain.pastWeek')}:`)
    expect(items[4].children[1].innerHTML).toBe('-10%')

    const noResultText = localeTool.t('common.noResultYet')
    expect(screen.queryByText(noResultText)).toBeFalsy()
  })

  test('could render empty', () => {
    render(
      <ValueChangePercents
        yearlyPercentNumber={null}
        pastYearPercentNumber={null}
        pastQuarterPercentNumber={null}
        pastMonthPercentNumber={null}
        pastWeekPercentNumber={null}
      />,
    )

    const noResultText = localeTool.t('common.noResultYet')
    expect(screen.queryByText(noResultText)).toBeTruthy()
  })
})
