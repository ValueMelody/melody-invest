import classNames from 'classnames'
import { Link } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles((theme: interfaces.common.Theme) => ({
  footer: {
    width: '100%',
    backgroundColor: theme.Black,
    height: '4rem',
    padding: '0 1rem',
    color: theme.LightGray,
  },
  links: {
    borderTop: `1px solid ${theme.LightGray}`,
  },
  link: {
    color: theme.LightGray,
    marginRight: '1.5rem',
    '&:hover': {
      color: theme.LightGray,
    },
  },
}))

const Footer = () => {
  // ------------------------------------------------------------ State -

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  // ------------------------------------------------------------ UI -

  return (
    <footer
      data-testid='footer'
      className={classNames(
        classes.footer,
        commonClasses.columnStart,
      )}
    >
      <h5>{localeTool.t('page.disclaimer')}</h5>
      <div className={classNames(
        classes.links,
        commonClasses.rowStart,
      )}>
        <a href='mailto: valuemelody@outlook.com' className={classes.link}>
          {localeTool.t('common.contactUs')}
        </a>
        <Link
          to={routerTool.privacyRoute()}
          className={classes.link}
        >
          {localeTool.t('page.privacyPolicy')}
        </Link>
        <Link
          to={routerTool.termsRoute()}
          className={classes.link}
        >
          {localeTool.t('page.termsPolicy')}
        </Link>
      </div>
    </footer>
  )
}

export default Footer
