import { render, screen, waitFor } from 'test.utils'
import Terms from './Terms'
import * as requestAdapter from 'adapters/request'
import * as constants from '@shared/constants'

const fetchMock = jest.fn(async (url: string) => {
  const baseUrl = 'http://127.0.0.1:3100/system/policy'
  if (url === `${baseUrl}/${constants.Content.PolicyType.TermsAndConditions}`) {
    return {
      id: 1,
      content: 'This is a term',
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

describe('#Terms', () => {
  test('could render terms', async () => {
    render(
      <Terms />,
    )
    const content = await waitFor(() => screen.queryByTestId('terms-content'))
    expect(content?.innerHTML).toBe('This is a term')
    expect(fetchMock).toBeCalledTimes(1)
  })

  test('do not fetch if content exists', async () => {
    render(
      <Terms />,
      {
        store: {
          resources: {
            termsPolicy: 'Terms already fetched',
          },
        },
      },
    )
    const content = await waitFor(() => screen.queryByTestId('terms-content'))
    expect(content?.innerHTML).toBe('Terms already fetched')
    expect(fetchMock).toBeCalledTimes(0)
  })
})
