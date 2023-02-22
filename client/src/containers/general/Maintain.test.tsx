import * as localeTool from 'tools/locale'
import { render, screen } from 'test.utils'
import Maintain from './Maintain'

describe('#Maintain', () => {
  test('could render message', () => {
    render(<Maintain />)
    const text = localeTool.t('page.maintaining')
    expect(screen.queryByText(text)).toBeInTheDocument()
  })
})
