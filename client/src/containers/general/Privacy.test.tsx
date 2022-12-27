import * as constants from '@shared/constants'
import * as requestAdapter from 'adapters/request'
import { render, screen, waitFor } from 'test.utils'
import Privacy from './Privacy'
import { contentSlice } from 'stores/content'
import { store } from 'stores'

jest.mock('adapters/request', () => {
  const actual = jest.requireActual('adapters/request')
  return {
    __esModule: true,
    ...actual,
  }
})

const fetchMock = jest.fn(async (url: string) => {
  const baseUrl = 'http://127.0.0.1:3100/system/policy'
  if (url === `${baseUrl}/${constants.Content.PolicyType.Privacy}`) {
    return {
      id: 2,
      type: 1,
      content: 'This is about privacy',
    }
  }
  return null
})

jest
  .spyOn(requestAdapter, 'sendGetRequest')
  .mockImplementation(fetchMock)

afterEach(() => {
  jest.clearAllMocks()
})

describe('#Privacy', () => {
  test('could render privacy', async () => {
    render(
      <Privacy />,
    )
    const content = screen.queryByTestId('privacy-content')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(content?.innerHTML).toBe('This is about privacy'))
  })

  test('do not fetch if content exists', async () => {
    store.dispatch(contentSlice.actions._updateForTest({
      privacyPolicy: {
        id: 1,
        type: 1,
        content: 'Privacy already fetched',
        createdAt: new Date(),
      },
    }))
    render(<Privacy />)
    const content = screen.queryByTestId('privacy-content')
    await waitFor(() => {
      expect(content?.innerHTML).toBe('Privacy already fetched')
      expect(fetchMock).toBeCalledTimes(0)
    })
  })
})
