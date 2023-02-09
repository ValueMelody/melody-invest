import { act, render, screen } from 'test.utils'
import Router from './Router'

jest.mock('react-select', () => '')

jest.mock('enums/common', () => {
  const actual = jest.requireActual('enums/common')
  return {
    ...actual,
    Env: {
      IsMaintaining: true,
    },
  }
})

describe('#Router', () => {
  test('could render maintain page', async () => {
    await act(() => {
      render(<Router />)
    })
    expect(screen.queryByTestId('maintain')).toBeInTheDocument()
  })
})
