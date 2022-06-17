import { render, screen } from 'test.utils'
import RequiredLabel from './RequiredLabel'

describe('#RequiredLabel', () => {
  test('could render required label', () => {
    render(
      <RequiredLabel
        title='test title'
      />,
    )
    const container = screen.getByTestId('requiredLabel')
    expect(container).toBeTruthy()
    expect(screen.getByText('test title')).toBeTruthy()
    const mark = screen.getByText('*')
    expect(mark).toBeTruthy()
    expect(mark.className).toContain('required')
  })
})
