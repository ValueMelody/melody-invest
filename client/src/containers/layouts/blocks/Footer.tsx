import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { Link } from 'react-router-dom'

const linkClass = 'px-2'

const Footer = () => {
  return (
    <footer
      data-testid='footer'
      className='bg-black w-full text-slate-200 px-4 py-2'
    >
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
        <Link
          to={routerTool.disclaimerRoute()}
          className={linkClass}
        >
          {localeTool.t('common.disclaimer')}
        </Link>
      </section>
    </footer>
  )
}

export default Footer
