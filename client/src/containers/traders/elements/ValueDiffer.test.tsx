import * as localeTool from 'tools/locale'
import { render, screen } from 'test.utils'
import ValueDiffer from './ValueDiffer'

describe('#ValueDiffer', () => {
  test('do not render if there is no differ', () => {
    render(
      <ValueDiffer
        title='test title'
        currentValue={50}
        compareValue={50}
      />,
    )
    const container = screen.queryByTestId('valueDiffer')
    expect(container).toBeFalsy()
  })

  test('could render positive differ', () => {
    render(
      <ValueDiffer
        title='test title'
        currentValue={75}
        compareValue={50}
      />,
    )
    const container = screen.getByTestId('valueDiffer')
    expect(container).toBeTruthy()
    expect(screen.getByText('test title:')).toBeTruthy()
    expect(screen.getByText('50.00%')).toBeTruthy()
    expect(container.children[1]?.classList).toContain('bg-green-100')
    expect(container.children[1]?.classList).not.toContain('bg-red-100')
    expect(container.children[1]?.getAttribute('title')).toBe(localeTool.t('profile.value.increased'))
  })

  test('could render positive differ', () => {
    render(
      <ValueDiffer
        title=''
        currentValue={50}
        compareValue={75}
      />,
    )
    const container = screen.getByTestId('valueDiffer')
    expect(container).toBeTruthy()
    expect(container.querySelector('h5')).toBeFalsy()
    expect(screen.getByText('-33.33%')).toBeTruthy()
    expect(container.children[0]?.classList).toContain('bg-red-100')
    expect(container.children[0]?.classList).not.toContain('bg-green-100')
    expect(container.children[0]?.getAttribute('title')).toBe(localeTool.t('profile.value.decreased'))
  })
})
