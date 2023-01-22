import { render, screen } from 'test.utils'
import PageTitle from './PageTitle'

describe('#PageTitle', () => {
  test('could render with title', () => {
    const { container } = render(
      <PageTitle
        title='test title'
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText('test title')).toBeInTheDocument()
  })

  test('could render with svg', () => {
    const { container } = render(
      <PageTitle
        title='test title'
        icon='performance'
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()

    const { container: boxContainer } = render(
      <PageTitle
        title='test title'
        icon='boxes'
      />,
    )
    expect(boxContainer.querySelector('svg')).toBeInTheDocument()

    const { container: bookmarkContainer } = render(
      <PageTitle
        title='test title'
        icon='bookmark'
      />,
    )
    expect(bookmarkContainer.querySelector('svg')).toBeInTheDocument()

    const { container: historyContainer } = render(
      <PageTitle
        title='test title'
        icon='history'
      />,
    )
    expect(historyContainer.querySelector('svg')).toBeInTheDocument()

    const { container: pieContainer } = render(
      <PageTitle
        title='test title'
        icon='pie'
      />,
    )
    expect(pieContainer.querySelector('svg')).toBeInTheDocument()

    const { container: starContainer } = render(
      <PageTitle
        title='test title'
        icon='star'
      />,
    )
    expect(starContainer.querySelector('svg')).toBeInTheDocument()
  })
})
