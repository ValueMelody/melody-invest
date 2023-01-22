import { fireEvent, render, screen } from 'test.utils'
import AddButton from './AddButton'

describe('#AddButton', () => {
  test('could render with props', () => {
    const onClick = jest.fn()
    const { container } = render(
      <AddButton
        title='test title'
        tooltip='test tooltip'
        onClick={onClick}
      />,
    )
    expect(screen.queryByText('test title')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    const button = container.querySelector('button') as HTMLButtonElement
    fireEvent.click(button)
    expect(onClick).toBeCalledTimes(1)
    expect(button.title).toBe('test tooltip')
  })
})
