import * as interfaces from '@shared/interfaces'
import { act, fireEvent, render, screen, waitFor } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import EnvBuilder from './EnvBuilder'
import axios from 'axios'

jest.mock('react-select', () => '')

const date = new Date()
const year = date.getFullYear()

const navigate = jest.fn()
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => navigate,
  }
})

describe('#EnvBuilder', () => {
  test('disable create by default', () => {
    render(<EnvBuilder />)
    expect(screen.getByTestId('createButton')).toBeDisabled()
  })

  test('disable create by default', async () => {
    const post = jest.fn()

    const envType = mock<interfaces.traderEnvModel.Record>({})

    jest.spyOn(axios, 'post')
      .mockImplementation(async (url, req) => {
        post(url, req)
        return {
          data: {
            ...instance(envType),
            id: 12,
          },
        }
      })

    await act(() => {
      render(<EnvBuilder />)
    })
    fireEvent.click(screen.getByTestId('dateInput'))
    fireEvent.click(screen.getByText(year))
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'test env' } })
    fireEvent.submit(screen.getByTestId('form'))

    await waitFor(() => {
      expect(post).toBeCalledTimes(1)
      expect(post).toBeCalledWith('http://127.0.0.1:3100/traders/envs', {
        name: 'test env',
        startDate: `${year}-01-01`,
        tickerIds: null,
      })
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('/traders/envs/12')
    })
  })
})
