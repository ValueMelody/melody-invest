import * as routerEnum from 'enums/router'
import { act, render, screen } from 'test.utils'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { store } from 'stores'
import Client from './Client'

jest.mock('react-select', () => '')

afterAll(() => {
  store.dispatch(globalSlice.actions._resetForTest())
})

describe('#Client', () => {
  test('could render without loader', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.Root] })

    render(<Client />, { history })

    act(() => {
      store.dispatch(globalSlice.actions.stopLoading())
    })
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  test('could render with loader', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.Root] })

    render(<Client />, { history })

    act(() => {
      store.dispatch(globalSlice.actions.startLoading())
    })
    expect(screen.queryByTestId('loader')).toBeInTheDocument()
  })
})
