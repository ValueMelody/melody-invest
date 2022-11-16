import * as localeTool from 'tools/locale'
import { fireEvent, render, screen } from 'test.utils'
import WeightChart from './WeightChart'

describe('#WeightChart', () => {
  const data = [
    {
      label: 'aaa label',
      desc: 'aaa desc',
      value: 0.3,
    },
    {
      label: 'bbb label',
      desc: 'bbb desc',
      value: 0.45,
    },
    {
      label: 'ccc label',
      desc: 'ccc desc',
      value: 0.25,
    },
  ]

  test('could render', () => {
    const onMouseEnter = jest.fn()

    const { container } = render(
      <WeightChart
        data={data}
        activeIndex={0}
        onMouseEnter={onMouseEnter}
      />,
    )

    expect(screen.queryByText('aaa label')).toBeTruthy()
    expect(screen.queryByText('bbb label')).toBeFalsy()
    expect(screen.queryByText('ccc label')).toBeFalsy()
    expect(screen.queryByText('aaa desc')).toBeTruthy()
    expect(screen.queryByText('bbb desc')).toBeFalsy()
    expect(screen.queryByText('ccc desc')).toBeFalsy()
    expect(screen.queryByText(`${localeTool.t('common.weight')}: 30.00%`)).toBeTruthy()
    expect(screen.queryByText(`${localeTool.t('common.weight')}: 45.00%`)).toBeFalsy()
    expect(screen.queryByText(`${localeTool.t('common.weight')}: 25.00%`)).toBeFalsy()

    const charts = container.querySelectorAll('.recharts-pie-sector')
    expect(charts.length).toBe(3)

    if (charts) {
      fireEvent.mouseEnter(charts[0])
      expect(onMouseEnter).toBeCalledTimes(1)
      expect(onMouseEnter).toBeCalledWith(0)

      fireEvent.mouseEnter(charts[1])
      expect(onMouseEnter).toBeCalledTimes(2)
      expect(onMouseEnter).toBeCalledWith(1)

      fireEvent.mouseEnter(charts[2])
      expect(onMouseEnter).toBeCalledTimes(3)
      expect(onMouseEnter).toBeCalledWith(2)
    }
  })

  test('could render different activeIndex', () => {
    render(
      <WeightChart
        data={data}
        activeIndex={1}
        onMouseEnter={() => {}}
      />,
    )

    expect(screen.queryByText('bbb label')).toBeTruthy()
    expect(screen.queryByText('aaa label')).toBeFalsy()
    expect(screen.queryByText('ccc label')).toBeFalsy()
    expect(screen.queryByText('bbb desc')).toBeTruthy()
    expect(screen.queryByText('aaa desc')).toBeFalsy()
    expect(screen.queryByText('ccc desc')).toBeFalsy()
  })

  test('could render null', () => {
    const { container } = render(
      <WeightChart
        data={[]}
        activeIndex={1}
        onMouseEnter={() => {}}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('could render empty value', () => {
    render(
      <WeightChart
        data={[{
          label: 'aaa label',
          desc: 'aaa desc',
          value: 0,
        }, {
          label: 'bbb label',
          desc: 'bbb desc',
          value: 0.5,
        }]}
        activeIndex={0}
        onMouseEnter={() => {}}
      />,
    )

    const text = localeTool.t('common.weight')

    expect(screen.queryByText('aaa label')).toBeTruthy()
    expect(screen.queryByText('aaa desc')).toBeTruthy()
    expect(screen.queryByText(text)).toBeFalsy()
  })
})
