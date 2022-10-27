import { render, screen, waitFor } from 'test.utils'
import Privacy from './Privacy'
import * as requestAdapter from 'adapters/request'
import * as constants from '@shared/constants'

const fetchMock = jest.fn(async (url: string) => {
  const baseUrl = 'http://127.0.0.1:3100/system/policy'
  if (url === `${baseUrl}/${constants.Content.PolicyType.Privacy}`) {
    return {
      id: 2,
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
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    await waitFor(() => screen.queryByText('This is about privacy'))
  })

  test('do not fetch if content exists', async () => {
    render(
      <Privacy />,
      {
        store: {
          resources: {
            privacyPolicy: 'Privacy already fetched',
          },
        },
      },
    )
    const content = await waitFor(() => screen.queryByTestId('privacy-content'))
    expect(content?.innerHTML).toBe('Privacy already fetched')
    expect(fetchMock).toBeCalledTimes(0)
  })
})
