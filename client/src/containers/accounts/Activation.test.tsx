import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as usePublicGuard from 'hooks/usePublicGuard'
import * as userAction from 'actions/user'
import { Route, Routes } from 'react-router-dom'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { render } from 'test.utils'
import Activation from './Activation'

jest.mock('hooks/usePublicGuard', () => {
  const actual = jest.requireActual('hooks/usePublicGuard')
  return {
    __esModule: true,
    ...actual,
  }
})

jest.mock('actions/user', () => {
  const actual = jest.requireActual('actions/user')
  return {
    __esModule: true,
    ...actual,
  }
})

const activateUser = jest.fn()
jest.spyOn(userAction, 'activateUser')
  .mockImplementation(createAsyncThunk(
    'test/activateUserTest',
    activateUser,
  ))

const publicGuard = jest.fn()
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

describe('#Activation', () => {
  test('has public guard', () => {
    render(<Activation />)
    expect(publicGuard).toBeCalled()
  })

  test('could hanlde invalid code', () => {
    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Activation}/112233`] })
    render(
      <Routes>
        <Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
      </Routes>,
      { history },
    )
    expect(history.location.pathname).toBe(routerTool.signInRoute())
    expect(activateUser).toBeCalledTimes(0)
  })

  test('could trigger activation', () => {
    let code = ''
    for (let i = 1; i <= 64; i++) {
      code = `${code}1`
    }

    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Activation}/${code}`] })
    render(
      <Routes>
        <Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
      </Routes>,
      { history },
    )
    expect(activateUser).toBeCalledTimes(1)
    expect(activateUser).toBeCalledWith(code, expect.anything())
  })
})
