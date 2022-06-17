import { render, screen } from 'test.utils'
import ValueDiffer from './ValueDiffer'
import * as localeTool from 'tools/locale'

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
    expect(container.querySelector('.up')).toBeTruthy()
    expect(container.querySelector('.down')).toBeFalsy()
    expect(container.querySelector('.label')?.classList).toContain('green')
    expect(container.querySelector('.label')?.classList).not.toContain('red')
    expect(container.querySelector('.label')?.getAttribute('title')).toBe(localeTool.t('profile.value.increased'))
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
    expect(container.querySelector('.down')).toBeTruthy()
    expect(container.querySelector('.up')).toBeFalsy()
    expect(container.querySelector('.label')?.classList).toContain('red')
    expect(container.querySelector('.label')?.classList).not.toContain('green')
    expect(container.querySelector('.label')?.getAttribute('title')).toBe(localeTool.t('profile.value.decreased'))
  })
})
