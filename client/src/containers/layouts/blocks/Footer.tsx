import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  footer: {
    width: '100%',
    backgroundColor: 'black',
    height: '2.5rem',
    padding: '0 1rem',
  },
  link: {
    color: 'lightgray',
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
    </footer>
  )
}

export default Footer
