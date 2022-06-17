import * as vendorTool from 'tools/vendor'

const useStyles = vendorTool.jss.createUseStyles({
  label: {
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
  },
  icon: {
    marginRight: '0.5rem !important',
  },
})

const HeaderLink = ({
  title,
  route,
  icon,
}: {
  title?: string,
  route: string,
  icon: vendorTool.ui.SemanticICONS,
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()

  return (
    <vendorTool.router.Link to={route}>
      <vendorTool.ui.Label className={classes.label}>
        <vendorTool.ui.Icon
          name={icon}
          className={vendorTool.classNames({ [classes.icon]: !!title })}
        />
        {title || ''}
      </vendorTool.ui.Label>
    </vendorTool.router.Link>
  )
}

export default HeaderLink
