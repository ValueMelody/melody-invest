import ValueChangeCharts from './ValueChangeCharts'
import { fireEvent, render, screen } from 'test.utils'
import * as localeTool from 'tools/locale'

describe('#ValueChangeCharts', () => {
  test('could render', async () => {
    const onChange = jest.fn()

    const { container } = render(
      <ValueChangeCharts
        oneDecadeTrends={[0, 10, 20, 30, 40, 50]}
        oneYearTrends={[0, 1, 2, 3, 4]}
        totalValue={50}
        activeChartIndex={0}
        onChangeChart={onChange}
      />,
    )

    const area = container.querySelector('.recharts-area-area')
    expect(area?.getAttribute('points')?.split(',').length).toBe(7)

    const decadeText = localeTool.t('common.yearsTrends', { num: 6 })
    const decadeButton = screen.getByText(decadeText)
    expect(decadeButton.classList).toContain('blue')

    fireEvent.click(decadeButton)
    expect(onChange).toBeCalledTimes(1)
    expect(onChange).toBeCalledWith(0)

    const yearText = localeTool.t('common.daysTrends', { num: 150 })
    const yearButton = screen.getByText(yearText)
    expect(yearButton.classList).not.toContain('blue')

    fireEvent.click(yearButton)
    expect(onChange).toBeCalledTimes(2)
    expect(onChange).toBeCalledWith(1)
  })

  test('could render correct chart', async () => {
    const { container } = render(
      <ValueChangeCharts
        oneDecadeTrends={[0, 10, 20, 30, 40, 50]}
        oneYearTrends={[0, 1, 2, 3, 4]}
        totalValue={50}
        activeChartIndex={1}
        onChangeChart={() => {}}
      />,
    )

    const area = container.querySelector('.recharts-area-area')
    expect(area?.getAttribute('points')?.split(',').length).toBe(6)

    const decadeText = localeTool.t('common.yearsTrends', { num: 6 })
    const decadeButton = screen.getByText(decadeText)
    expect(decadeButton.classList).not.toContain('blue')
    const yearText = localeTool.t('common.daysTrends', { num: 150 })
    const yearButton = screen.getByText(yearText)
    expect(yearButton.classList).toContain('blue')
  })

  test('could render as empty', async () => {
    const { container } = render(
      <ValueChangeCharts
        oneDecadeTrends={[]}
        oneYearTrends={[]}
        totalValue={50}
        activeChartIndex={1}
        onChangeChart={() => {}}
      />,
    )

    expect(container).toBeEmptyDOMElement()

    const { container: container1 } = render(
      <ValueChangeCharts
        oneDecadeTrends={null}
        oneYearTrends={null}
        totalValue={50}
        activeChartIndex={1}
        onChangeChart={() => {}}
      />,
    )

    expect(container1).toBeEmptyDOMElement()
  })
})