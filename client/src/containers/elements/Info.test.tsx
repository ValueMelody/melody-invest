import { render, screen } from 'test.utils'
import Info from './Info'

describe('#Info', () => {
  test('could render tooltip', () => {
    const { container } = render(<Info title='test tooltip' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText('test tooltip')).toBeInTheDocument()
  })
})
