import * as interfaces from '@shared/interfaces'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = vendorTool.jss.createUseStyles((theme: interfaces.common.Theme) => ({
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
    <footer className={vendorTool.classNames(
      classes.footer,
      commonClasses.columnStart,
    )}>
      <h5>{localeTool.t('page.disclaimer')}</h5>
      <div className={vendorTool.classNames(
        classes.links,
        commonClasses.rowStart,
      )}>
        <a href='mailto: valuemelody@outlook.com' className={classes.link}>
          {localeTool.t('common.contactUs')}
        </a>
        <vendorTool.router.Link
          to={routerTool.privacyRoute()}
          className={classes.link}
        >
          {localeTool.t('page.privacyPolicy')}
        </vendorTool.router.Link>
        <vendorTool.router.Link
          to={routerTool.termsRoute()}
          className={classes.link}
        >
          {localeTool.t('page.termsPolicy')}
        </vendorTool.router.Link>
      </div>
    </footer>
  )
}

export default Footer
