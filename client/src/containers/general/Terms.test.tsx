import * as constants from '@shared/constants'
import * as requestAdapter from 'adapters/request'
import { render, screen, waitFor } from 'test.utils'
import Terms from './Terms'
import { contentSlice } from 'stores/content'
import { store } from 'stores'

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
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    await waitFor(() => screen.queryByText('This is a term'))
  })

  test('do not fetch if content exists', async () => {
    store.dispatch(contentSlice.actions._updateForTest({
      termsPolicy: {
        id: 1,
        type: 2,
        content: 'Terms already fetched',
        createdAt: new Date(),
      },
    }))
    render(<Terms />)
    const content = await waitFor(() => screen.queryByTestId('terms-content'))
    waitFor(() => {
      expect(content?.innerHTML).toBe('Terms already fetched')
      expect(fetchMock).toBeCalledTimes(0)
    })
  })
})
