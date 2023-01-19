import { act, render, screen } from 'test.utils'
import Layout from 'containers/layouts/Layout'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

afterEach(() => {
  store.dispatch(globalSlice.actions._resetForTest())
})

describe('#Layout', () => {
  test('could render layout', () => {
    render(
      <Layout>
        <p>test children</p>
      </Layout>,
    )
    expect(screen.queryByTestId('header')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByText('test children')).toBeInTheDocument()
  })

  test('could render messages', () => {
    store.dispatch(globalSlice.actions.addMessage({
      title: 'test 1',
      type: 'success',
    }))
    render(<Layout />)

    act(() => {
      store.dispatch(globalSlice.actions.addMessage({
        title: 'test 2',
        type: 'warning',
      }))
    })

    expect(screen.queryByText('test 2')).toBeInTheDocument()
  })
})
