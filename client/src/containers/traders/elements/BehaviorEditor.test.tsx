import BehaviorEditor from './BehaviorEditor'
import { fireEvent, render, screen } from 'test.utils'
import * as localeTool from 'tools/locale'

describe('#BehaviorEditor', () => {
  test('could render as behavior label', () => {
    const onClick = jest.fn()
    render(
      <BehaviorEditor
        behavior='priceDailyIncreaseBuy'
        isEditing={false}
        behaviorValue={1}
        onClick={onClick}
        onSelect={() => {}}
      />,
    )

    expect(screen.queryByTestId('behaviorEditor')).toBeFalsy()

    const label = screen.getByTestId('behaviorLabel')
    expect(label.className).toContain('blue')

    fireEvent.click(label)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith('priceDailyIncreaseBuy')
  })

  test('could render as disabled label if value is not valid', () => {
    render(
      <BehaviorEditor
        behavior='priceDailyIncreaseBuy'
        isEditing={false}
        behaviorValue={10}
        onClick={() => {}}
        onSelect={() => {}}
      />,
    )
    const label = screen.getByTestId('behaviorLabel')
    expect(label.className).not.toContain('blue')
  })

  test('could render with dropdown', () => {
    const onSelect = jest.fn()
    const { container } = render(
      <BehaviorEditor
        behavior='priceDailyIncreaseBuy'
        isEditing
        behaviorValue={1}
        onClick={() => {}}
        onSelect={onSelect}
      />,
    )
    expect(screen.queryByTestId('behaviorEditor')).toBeTruthy()

    const options = screen.queryAllByRole('option')
    expect(options.length).toBe(5)

    const select = screen.getByTestId('select')

    fireEvent.change(select, {
      target: { value: 5 },
    })
    expect(onSelect).toBeCalledTimes(1)
    expect(onSelect).toBeCalledWith('priceDailyIncreaseBuy', 5)

    fireEvent.change(select, {
      target: { value: '' },
    })
    expect(onSelect).toBeCalledTimes(2)
    expect(onSelect).toBeCalledWith('priceDailyIncreaseBuy', null)
  })
})
