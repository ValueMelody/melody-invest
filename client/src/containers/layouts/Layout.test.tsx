import { act, fireEvent, render, screen } from 'test.utils'
import Layout from 'containers/layouts/Layout'
import axios from 'axios'
import { globalSlice } from 'stores/global'
import { store } from 'stores'
import { userSlice } from 'stores/user'

afterEach(() => {
  store.dispatch(globalSlice.actions._resetForTest())
  store.dispatch(userSlice.actions._resetForTest())
  jest.clearAllMocks()
})

const get = jest.fn()
jest.spyOn(axios, 'get')
  .mockImplementation(async (url) => {
    get()
    if (url === 'http://127.0.0.1:3100/system/defaults') {
      return {
        data: {
          traderEnvs: [],
          tickerCategories: [],
          tickerIdentities: [],
        },
      }
    }
    return {
      data: {
        type: 1,
        traderProfiles: [],
        traderCombos: [],
        traderEnvs: [],
      },
    }
  })

describe('#Layout', () => {
  test('could render layout', async () => {
    await act(() => {
      store.dispatch(globalSlice.actions._updateForTest({
        refreshToken: 'abc',
      }))
    })
    await act(() => {
      render(
        <Layout>
          <p>test children</p>
        </Layout>,
      )
    })
    expect(screen.queryByTestId('header')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByText('test children')).toBeInTheDocument()

    expect(get).toBeCalledTimes(2)
  })

  test('could render messages', async () => {
    await act(() => {
      store.dispatch(globalSlice.actions.addMessage({
        title: 'test 1',
        type: 'success',
      }))
    })
    await act(() => {
      render(<Layout />)
    })

    await act(() => {
      store.dispatch(globalSlice.actions.addMessage({
        title: 'test 2',
        type: 'warning',
      }))
    })

    expect(screen.queryByText('test 1')).toBeInTheDocument()
    expect(screen.queryByText('test 2')).toBeInTheDocument()
    const messages = screen.getByTestId('messages')
    expect(messages?.childNodes.length).toBe(2)

    await act(() => {
      fireEvent.click(screen.queryByText('test 2')!.parentNode!.parentNode!.querySelector('button')!)
    })
    expect(screen.queryByText('test 2')).not.toBeInTheDocument()
  })
})
