import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import * as routerTool from '../../tools/router'
import * as themeEnum from '../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  container: {
    alignItems: 'flex-start',
  },
  column: {
    width: '31%',
    border: '1px solid #eee',
    margin: 0,
    padding: 0,
    borderRadius: theme.BorderRadius,
    '&:hover': {
      boxShadow: '0 8px 12px 0 rgba(0,0,0,0.2)',
    },
  },
  basicHeader: {
    backgroundColor: theme.Gray,
  },
  proHeader: {
    backgroundColor: theme.PrimaryColor,
  },
  premiumHeader: {
    backgroundColor: theme.IncreaseColor,
  },
  header: {
    color: theme.White,
    width: '100%',
    textAlign: 'center',
    padding: '0.5rem',
    borderRadius: `${theme.BorderRadius}px ${theme.BorderRadius}px 0 0`,
  },
  highlight: {
    backgroundColor: theme.LightGray,
  },
  row: {
    padding: '0.5rem',
    width: '100%',
    textAlign: 'center',
  },
  signUp: {
    backgroundColor: theme.PrimaryColor,
    padding: '0.5rem 1rem',
    color: theme.LightGray,
    margin: '0.5rem 0 !important',
    borderRadius: theme.BorderRadius,
    '&:hover': {
      color: theme.LightGray,
    },
  },
}))

const Header = ({
  title,
  className,
}: {
  title: string,
  className: string,
}) => {
  const classes = useStyles()

  return (
    <header className={vendorTool.classNames(classes.header, className)}>
      <h2>{title}</h2>
    </header>
  )
}

const Price = ({
  title,
}: {
  title: string,
}) => {
  const classes = useStyles()

  return (
    <div className={vendorTool.classNames(classes.row, classes.highlight)}>
      <h3>{title}</h3>
    </div>
  )
}

const Item = ({
  title,
}: {
  title: string,
}) => {
  const classes = useStyles()

  return (
    <div className={vendorTool.classNames(classes.row)}>
      <h4>{title}</h4>
    </div>
  )
}

const Pricing = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ UI --

  return (
    <section className={vendorTool.classNames('row-around', classes.container)}>
      <section
        className={vendorTool.classNames('column-center', classes.column)}
      >
        <Header
          title={localeTool.t('pricing.basic')}
          className={vendorTool.classNames(classes.basicHeader)}
        />
        <Price title={localeTool.t('pricing.basicPrice')} />
        <Item title={localeTool.t('pricing.basicProfiles')} />
        <Item title={localeTool.t('pricing.basicEnvs')} />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <div
          className={vendorTool.classNames(
            classes.row, classes.highlight, 'row-around',
          )}
        >
          <vendorTool.router.Link
            to={routerTool.signUpRoute()}
            className={classes.signUp}
          >
            {localeTool.t('common.signUp')}
          </vendorTool.router.Link>
        </div>
      </section>
      <section
        className={vendorTool.classNames('column-center', classes.column)}
      >
        <Header
          title={localeTool.t('pricing.pro')}
          className={classes.proHeader}
        />
        <Price title={localeTool.t('pricing.proPrice')} />
        <Item title={localeTool.t('pricing.proProfiles')} />
        <Item title={localeTool.t('pricing.proEnvs')} />
        <Item title={localeTool.t('pricing.proCombos')} />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
      </section>
      <section
        className={vendorTool.classNames('column-center', classes.column)}
      >
        <Header
          title={localeTool.t('pricing.premium')}
          className={classes.premiumHeader}
        />
        <Price title={localeTool.t('pricing.premiumPrice')} />
        <Item title={localeTool.t('pricing.premiumProfiles')} />
        <Item title={localeTool.t('pricing.premiumEnvs')} />
        <Item title={localeTool.t('pricing.premiumCombos')} />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
        <Item title='' />
      </section>
    </section>
  )
}

export default Pricing
