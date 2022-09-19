import HeaderLink from './HeaderLink'
import { createMemoryHistory } from 'history'
import { fireEvent, render, screen } from 'test.utils'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'

describe('#BehaviorEditor', () => {
  test('could render Footer', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    const { container } = render(
      <HeaderLink
        title='test title'
        route='/testheaderlink'
        icon='audio description'
      />,
      { history },
    )

    expect(container.querySelector('.audio')).toBeTruthy()
    expect(container.querySelector('.description')).toBeTruthy()

    const link = screen.getByText('test title')
    fireEvent.click(link)
    expect(history.location.pathname).toBe('/testheaderlink')
  })
})
