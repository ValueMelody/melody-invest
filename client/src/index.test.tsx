import { render, screen, waitFor } from 'test.utils'
import { App } from './index'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

afterEach(() => {
  store.dispatch(globalSlice.actions._resetForTest())
})

jest.mock('./index.css', () => '')
jest.mock('react-datepicker/dist/react-datepicker.css', () => '')
jest.mock('./containers/Router', () => '')
jest.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: () => {},
    unmount: () => {},
  }),
}))

describe('#App', () => {
  test('do not render loader', () => {
    render(<App />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  test('render loader', () => {
    store.dispatch(globalSlice.actions.startLoading())
    render(<App />)
    waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeInTheDocument()
    })
  })
})
