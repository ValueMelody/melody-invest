import * as localeTool from 'tools/locale'
import { fireEvent, render, screen } from 'test.utils'
import ValueChangePanel from './ValueChangePanel'

describe('#ValueChangePanel', () => {
  test('could render all', async () => {
    const onChange = jest.fn()
    render(
      <ValueChangePanel
        yearlyPercentNumber={10}
        pastYearPercentNumber={20}
        pastQuarterPercentNumber={20}
        pastMonthPercentNumber={20}
        pastWeekPercentNumber={30}
        oneDecadeTrends={[1, 2, 3]}
        oneYearTrends={[3, 4, 5, 6]}
        totalValue={20}
        activeChartIndex={0}
        onChangeChart={onChange}
        showPercents
        showCharts
      />,
    )

    expect(screen.getByTestId('valueChangeCharts')).toBeTruthy()
    expect(screen.getByTestId('valueChangePercents')).toBeTruthy()

    const decadeText = localeTool.t('common.yearsTrends', { num: 3 })
    const decadeButton = screen.getByText(decadeText)

    fireEvent.click(decadeButton)
    expect(onChange).toBeCalledTimes(1)
    expect(onChange).toBeCalledWith(0)

    const yearText = localeTool.t('common.daysTrends', { num: 120 })
    const yearButton = screen.getByText(yearText)

    fireEvent.click(yearButton)
    expect(onChange).toBeCalledTimes(2)
    expect(onChange).toBeCalledWith(1)
  })

  test('could render charts only', async () => {
    render(
      <ValueChangePanel
        yearlyPercentNumber={10}
        pastYearPercentNumber={20}
        pastQuarterPercentNumber={20}
        pastMonthPercentNumber={20}
        pastWeekPercentNumber={30}
        oneDecadeTrends={[1, 2, 3]}
        oneYearTrends={[3, 4, 5, 6]}
        totalValue={20}
        activeChartIndex={0}
        onChangeChart={() => {}}
        showCharts
      />,
    )

    expect(screen.queryByTestId('valueChangeCharts')).toBeTruthy()
    expect(screen.queryByTestId('valueChangePercents')).toBeFalsy()
  })

  test('could render charts only', async () => {
    render(
      <ValueChangePanel
        yearlyPercentNumber={10}
        pastYearPercentNumber={20}
        pastQuarterPercentNumber={20}
        pastMonthPercentNumber={20}
        pastWeekPercentNumber={30}
        oneDecadeTrends={[1, 2, 3]}
        oneYearTrends={[3, 4, 5, 6]}
        totalValue={20}
        activeChartIndex={0}
        onChangeChart={() => {}}
        showCharts
      />,
    )

    expect(screen.queryByTestId('valueChangeCharts')).toBeTruthy()
    expect(screen.queryByTestId('valueChangePercents')).toBeFalsy()
  })

  test('could render percents only', async () => {
    render(
      <ValueChangePanel
        yearlyPercentNumber={10}
        pastYearPercentNumber={20}
        pastQuarterPercentNumber={20}
        pastMonthPercentNumber={20}
        pastWeekPercentNumber={30}
        oneDecadeTrends={[1, 2, 3]}
        oneYearTrends={[3, 4, 5, 6]}
        totalValue={20}
        activeChartIndex={0}
        onChangeChart={() => {}}
        showPercents
      />,
    )

    expect(screen.queryByTestId('valueChangeCharts')).toBeFalsy()
    expect(screen.queryByTestId('valueChangePercents')).toBeTruthy()
  })

  test('could render as empty', async () => {
    const { container } = render(
      <ValueChangePanel
        yearlyPercentNumber={10}
        pastYearPercentNumber={20}
        pastQuarterPercentNumber={20}
        pastMonthPercentNumber={20}
        pastWeekPercentNumber={30}
        oneDecadeTrends={[1, 2, 3]}
        oneYearTrends={[3, 4, 5, 6]}
        totalValue={20}
        activeChartIndex={0}
        onChangeChart={() => {}}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
