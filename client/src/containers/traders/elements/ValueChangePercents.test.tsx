import * as localeTool from 'tools/locale'
import { render, screen } from 'test.utils'
import ValueChangePercents from './ValueChangePercents'

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

    const ths = container.querySelectorAll('th')
    expect(ths.length).toBe(5)

    const tds = container.querySelectorAll('td')
    expect(tds.length).toBe(5)

    expect(ths[0].innerHTML).toBe(`${localeTool.t('gain.yearly')}:`)
    expect(tds[0].innerHTML).toBe('111.11%')
    expect(ths[1].innerHTML).toBe(`${localeTool.t('gain.pastYear')}:`)
    expect(tds[1].innerHTML).toBe('122.22%')
    expect(ths[2].innerHTML).toBe(`${localeTool.t('gain.pastQuarter')}:`)
    expect(tds[2].innerHTML).toBe('30%')
    expect(ths[3].innerHTML).toBe(`${localeTool.t('gain.pastMonth')}:`)
    expect(tds[3].innerHTML).toBe('50%')
    expect(ths[4].innerHTML).toBe(`${localeTool.t('gain.pastWeek')}:`)
    expect(tds[4].innerHTML).toBe('-10%')

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
