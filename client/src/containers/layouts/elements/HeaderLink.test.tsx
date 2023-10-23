import { fireEvent, render, screen } from 'test.utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { createMemoryHistory } from 'history'
import HeaderLink from './HeaderLink'

describe('#HeaderLink', () => {
  test('could render Footer', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(
      <HeaderLink
        title='test title'
        route='/testheaderlink'
        icon={StarIcon}
      />,
      { history },
    )

    const link = screen.getByText('test title')
    fireEvent.click(link)
    expect(history.location.pathname).toBe('/testheaderlink')
  })
})
