import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { UserAccess, UserState } from 'stores/user'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ProfileBuilder from './ProfileBuilder'
import axios from 'axios'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

store.dispatch(globalSlice.actions._updateForTest({
  refreshToken: 'aaa',
}))

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

const navigate = jest.fn()
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)

const envType = mock<interfaces.traderEnvModel.Identity>({})
const env1 = { ...instance(envType), id: 1 }
const env2 = { ...instance(envType), id: 2 }

const post = jest.fn()
jest.spyOn(axios, 'post').mockImplementation(async (url, params) => {
  post(url, params)
  return {
    data: {
      trader: {
        id: 33,
        accessCode: 'ccc',
      },
    },
  }
})

describe('#ProfileBuilder', () => {
  test('disable create button by default', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBases')
      .mockImplementation(() => () => {
        return [env1, env2]
      })

    const userType = mock<UserState>({})
    const accessType = mock<UserAccess>({})
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        userTraderIds: [],
        access: {
          ...instance(accessType),
          accessibleEnvIds: [1, 2],
        },
      }))

    await act(() => {
      render(<ProfileBuilder />)
    })
    expect(screen.getByTestId('createBtn')).toBeDisabled()

    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)
    expect(envs[0].className).toContain('card-active')
    expect(envs[1].className).not.toContain('card-active')

    fireEvent.click(envs[0])
    expect(envs[0].className).toContain('card-active')
    expect(envs[1].className).not.toContain('card-active')

    fireEvent.click(envs[1])
    expect(envs[0].className).not.toContain('card-active')
    expect(envs[1].className).toContain('card-active')

    const headers = screen.getAllByTestId('profileBuilderHeader')
    expect(headers.length).toBe(5)
    expect(screen.queryAllByTestId('profileBuilderGroup').length).toBe(16)

    const behaviorLabels = screen.getAllByTestId('behaviorLabel')
    expect(behaviorLabels.length).toBe(constants.Behavior.Behaviors.length)

    fireEvent.click(behaviorLabels[0])
    expect(screen.getAllByTestId('behaviorEditor').length).toBe(1)

    fireEvent.click(screen.getAllByTestId('behaviorLabel')[0])
    expect(screen.queryAllByTestId('behaviorEditor').length).toBe(0)

    fireEvent.click(screen.getAllByTestId('behaviorLabel')[1])
    fireEvent.change(screen.getByTestId('select'), { target: { value: 3 } })
    expect(screen.queryAllByTestId('behaviorEditor').length).toBe(0)
    expect(screen.getAllByTestId('behaviorLabel')[1].innerHTML).toContain(': 3')

    await act(() => {
      fireEvent.submit(screen.getByTestId('submitForm'))
    })
    expect(post).toBeCalledTimes(1)
    expect(post).toBeCalledWith(
      'http://127.0.0.1:3100/traders/profiles',
      expect.any(Object),
    )
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/33/ccc')
  })
})
