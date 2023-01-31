import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { Link } from 'react-router-dom'

const linkClass = 'px-2 border-t-2 border-slate-400'

const Footer = () => {
  return (
    <footer
      data-testid='footer'
      className='bg-black w-full text-slate-200 px-4 py-2'
    >
      <h5>{localeTool.t('page.disclaimer')}</h5>
      <section className='flex'>
        <Link
          to={routerTool.pricingRoute()}
          className={linkClass}
        >
          {localeTool.t('common.pricing')}
        </Link>
        <a
          href='mailto: app@valuemelody.com'
          className={linkClass}
        >
          {localeTool.t('common.contactUs')}
        </a>
        <Link
          to={routerTool.privacyRoute()}
          className={linkClass}
        >
          {localeTool.t('page.privacyPolicy')}
        </Link>
        <Link
          to={routerTool.termsRoute()}
          className={linkClass}
        >
          {localeTool.t('page.termsPolicy')}
        </Link>
      </section>
    </footer>
  )
}

export default Footer
