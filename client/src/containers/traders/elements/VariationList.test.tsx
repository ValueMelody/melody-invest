import { render, screen, fireEvent } from '../../../test.utils'
import VariationList from './VariationList'

describe('#VariationList', () => {
  test('could load and display as expected', async () => {
    const onClickFirst = jest.fn()
    const onClickSecond = jest.fn()
    const onClickThird = jest.fn()
    const options = [
      { label: 'a', value: 1, onClick: onClickFirst },
      { label: 'b', value: 2, onClick: onClickSecond },
      { label: 'c', value: 3, onClick: onClickThird },
    ]
    render(
      <VariationList options={options} activeValue={2} />,
    )
    const container = screen.getByTestId('variationList')
    expect(container).toBeTruthy()
    expect(container.childNodes.length).toBe(3)

    expect(container.childNodes[0].textContent).toBe('a')
    expect(container.childNodes[1].textContent).toBe('b')
    expect(container.childNodes[2].textContent).toBe('c')

    expect(container.childNodes[1]).toHaveClass('blue')
    expect(container.childNodes[1]).toHaveClass('left')
    expect(container.childNodes[1]).toHaveClass('pointing')

    expect(container.childNodes[0]).not.toHaveClass('blue')
    expect(container.childNodes[0]).not.toHaveClass('left')
    expect(container.childNodes[0]).not.toHaveClass('pointing')

    expect(container.childNodes[2]).not.toHaveClass('blue')
    expect(container.childNodes[2]).not.toHaveClass('left')
    expect(container.childNodes[2]).not.toHaveClass('pointing')

    fireEvent.click(container.childNodes[0])
    expect(onClickFirst).toBeCalledTimes(1)
    expect(onClickSecond).toBeCalledTimes(0)
    expect(onClickThird).toBeCalledTimes(0)

    fireEvent.click(container.childNodes[2])
    expect(onClickFirst).toBeCalledTimes(1)
    expect(onClickSecond).toBeCalledTimes(0)
    expect(onClickThird).toBeCalledTimes(1)
  })
})
