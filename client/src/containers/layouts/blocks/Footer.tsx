import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  footer: {
    width: '100%',
    backgroundColor: theme.Black,
    height: '2.5rem',
    padding: '0 1rem',
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

  return (
    <footer className={vendorTool.classNames(classes.footer, 'row-start')}>
      <a href='mailto: valuemelody@outlook.com' className={classes.link}>
        {localeTool.t('common.contactUs')}
      </a>
      <vendorTool.router.Link
        to={routerTool.pricingRoute()}
        className={classes.link}
      >
        {localeTool.t('common.pricing')}
      </vendorTool.router.Link>
    </footer>
  )
}

export default Footer
