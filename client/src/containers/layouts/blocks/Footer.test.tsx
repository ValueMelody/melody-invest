import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { fireEvent, render, screen } from 'test.utils'
import Footer from './Footer'
import { createMemoryHistory } from 'history'

describe('#Footer', () => {
  test('could render Footer', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(<Footer />, { history })

    const privacyText = localeTool.t('page.privacyPolicy')
    const privacyButton = screen.getByText(privacyText)

    fireEvent.click(privacyButton)
    expect(history.location.pathname).toBe(routerTool.privacyRoute())

    const termsText = localeTool.t('page.termsPolicy')
    const termsButton = screen.getByText(termsText)

    fireEvent.click(termsButton)
    expect(history.location.pathname).toBe(routerTool.termsRoute())
  })
})
