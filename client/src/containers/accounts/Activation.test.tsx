import Activation from './Activation'
import { render } from 'test.utils'
import { createMemoryHistory } from 'history'
import * as routerEnum from 'enums/router'
import * as vendorTool from 'tools/vendor'
import * as routerTool from 'tools/router'
import * as useUserRequest from 'requests/useUserRequest'
import * as usePublicGuard from 'handlers/usePublicGuard'

const activateUser = jest.fn()
// @ts-ignore
jest.spyOn(useUserRequest, 'default').mockImplementation(() => ({
  activateUser,
}))

const publicGuard = jest.fn()
// @ts-ignore
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

describe('#Activation', () => {
  test('has public guard', () => {
    render(<Activation />)
    expect(publicGuard).toBeCalled()
  })

  test('could hanlde invalid code', () => {
    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Activation}/112233`] })
    render(
      <vendorTool.router.Routes>
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
      </vendorTool.router.Routes>,
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
      <vendorTool.router.Routes>
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
      </vendorTool.router.Routes>,
      { history },
    )
    expect(activateUser).toBeCalledTimes(1)
    expect(activateUser).toBeCalledWith(code)
  })
})
