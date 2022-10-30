import TrendChart from './TrendChart'
import { render, screen } from 'test.utils'

describe('#VariationList', () => {
  test('could render', async () => {
    const { container } = render(
      <TrendChart
        data={[
          {
            label: 'aaa', value: 10,
          },
          {
            label: 'bbb', value: 20,
          },
          {
            label: 'ccc', value: 0,
          },
          {
            label: 'ddd', value: -5,
          },
        ]}
      />,
    )

    const area = container.querySelector('.recharts-area-area')
    expect(area).toBeTruthy()

    const curve = container.querySelector('.recharts-area-curve')
    expect(curve).toBeTruthy()

    expect(area?.getAttribute('points')?.split(',').length).toBe(4)
  })

  test('could render as empty', async () => {
    const { container } = render(
      <TrendChart
        data={[
          {
            label: 'aaa', value: 10,
          },
        ]}
      />,
    )
    const area = container.querySelector('.recharts-area-area')
    expect(area).toBeFalsy()
    const curve = container.querySelector('.recharts-area-curve')
    expect(curve).toBeFalsy()

    const { container: container1 } = render(
      <TrendChart data={[]} />,
    )
    const area1 = container1.querySelector('.recharts-area-area')
    expect(area1).toBeFalsy()
    const curve1 = container1.querySelector('.recharts-area-curve')
    expect(curve1).toBeFalsy()
  })

  test('could render as title', async () => {
    const { container } = render(
      <TrendChart
        title='this is a title'
        data={[
          {
            label: 'aaa', value: 10,
          },
          {
            label: 'bbb', value: 10,
          },
        ]}
      />,
    )

    const area = container.querySelector('.recharts-area-area')
    expect(area?.getAttribute('points')?.split(',').length).toBe(2)

    expect(screen.getByText('this is a title')).toBeTruthy()
  })
})
