import { fireEvent, render, screen } from 'test.utils'
import ConfirmModal from './ConfirmModal'

describe('#ConfirmModal', () => {
  test('do not render is is not open', () => {
    render(
      <ConfirmModal
        title='confirm modal'
        isOpen={false}
        onClose={() => {}}
      />,
    )
    const container = screen.queryByTestId('confirmModal')
    expect(container).toBeFalsy()
  })

  test('could render ConfirmModal', () => {
    const onClose = jest.fn()
    render(
      <ConfirmModal
        title='confirm modal'
        isOpen
        onClose={onClose}
      >
        <h4>confirm description</h4>
      </ConfirmModal>,
    )
    const container = screen.getByTestId('confirmModal')
    expect(container).toBeTruthy()

    expect(screen.getByText('confirm modal')).toBeTruthy()

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(onClose).toBeCalledTimes(1)

    expect(screen.getByText('confirm description')).toBeTruthy()
  })
})
