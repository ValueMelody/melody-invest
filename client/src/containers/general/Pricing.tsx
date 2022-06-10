import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import * as routerTool from '../../tools/router'
import * as commonEnum from '../../enums/common'

const useStyles = vendorTool.jss.createUseStyles((theme: interfaces.common.Theme) => ({
  table: {
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    marginBottom: '2rem !important',
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
    <section className='column-start'>
      <h2 className={classes.title}>
        {localeTool.t('pricing.title')}:
      </h2>
      <section className={vendorTool.classNames('row-between', classes.table)}>
        <section
          className={vendorTool.classNames('column-center', classes.column)}
        >
          <Header
            title={commonEnum.Plan.Basic.Title}
            className={vendorTool.classNames(classes.basicHeader)}
          />
          <Price title={commonEnum.Plan.Basic.Price} />
          {commonEnum.Plan.Basic.Services.map((service) => (
            <Item key={service} title={service} />
          ))}
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
            title={commonEnum.Plan.Pro.Title}
            className={classes.proHeader}
          />
          <Price title={commonEnum.Plan.Pro.Price} />
          {commonEnum.Plan.Pro.Services.map((service) => (
            <Item key={service} title={service} />
          ))}
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
            title={commonEnum.Plan.Premium.Title}
            className={classes.premiumHeader}
          />
          <Price title={commonEnum.Plan.Premium.Price} />
          {commonEnum.Plan.Premium.Services.map((service) => (
            <Item key={service} title={service} />
          ))}
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
    </section>
  )
}

export default Pricing
