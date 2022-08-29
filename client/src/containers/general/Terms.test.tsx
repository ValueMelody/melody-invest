import { render, screen, waitFor } from 'test.utils'
import Terms from './Terms'
import * as requestAdapter from 'adapters/request'
import * as constants from '@shared/constants'

jest
  .spyOn(requestAdapter, 'sendGetRequest')
  .mockImplementation(async (url: string) => {
    const baseUrl = 'http://127.0.0.1:3100/system/policy'
    if (url === `${baseUrl}/${constants.Content.PolicyType.TermsAndConditions}`) {
      return {
        id: 1,
        content: 'This is a term',
      }
    }
    return null
  })

describe('#Terms', () => {
  test('could render terms', async () => {
    render(
      <Terms />,
    )
    const content = await waitFor(() => screen.queryByTestId('terms-content'))
    expect(content?.innerHTML).toBe('This is a term')
  })
})
