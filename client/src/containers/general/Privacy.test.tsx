import { render, screen, waitFor } from 'test.utils'
import Privacy from './Privacy'
import * as requestAdapter from 'adapters/request'
import * as constants from '@shared/constants'

jest
  .spyOn(requestAdapter, 'sendGetRequest')
  .mockImplementation(async (url: string) => {
    const baseUrl = 'http://127.0.0.1:3100/system/policy'
    if (url === `${baseUrl}/${constants.Content.PolicyType.Privacy}`) {
      return {
        id: 2,
        content: 'This is about privacy',
      }
    }
    return null
  })

describe('#Privacy', () => {
  test('could render privacy', async () => {
    render(
      <Privacy />,
    )
    const content = await waitFor(() => screen.queryByTestId('privacy-content'))
    expect(content?.innerHTML).toBe('This is about privacy')
  })
})
