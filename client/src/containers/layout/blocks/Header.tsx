import { Link } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Icon, Label } from 'semantic-ui-react'
import * as routerConstant from '../../../constants/router'
import * as themeConstant from '../../../constants/theme'
import * as localeTool from '../../../tools/locale'
import useCommon from '../../../states/useCommon'

const useStyles = createUseStyles((theme: themeConstant.Theme) => ({
  header: {
    height: '3rem',
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: theme.PRIMARY_COLOR,
    paddingLeft: '1rem',
    paddingRight: '1rem',
    zIndex: 1000,
  },
  label: {
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
  },
  icon: {
    marginRight: '0.5rem !important',
  },
}))

const Header = () => {
  const classes = useStyles()
  const { userType } = useCommon()

  return (
    <header className={classNames('row-between', classes.header)}>
      <nav>
        <Link to={routerConstant.NAVS.TOP_PROFILES}>
          <Label className={classes.label}>
            <Icon name='chart line' className={classes.icon} />
            {localeTool.t('top.title')}
          </Label>
        </Link>
      </nav>
      <nav>
        {userType && (
          <Link to={routerConstant.NAVS.DASHBOARD}>
            <Label className={classes.label}>
              <Icon name='table' className={classes.icon} />
              {localeTool.t('dashboard.title')}
            </Label>
          </Link>
        )}
        <Link to={routerConstant.NAVS.SIGN_IN}>
          <Label className={classes.label}>
            <Icon name='user circle' />
          </Label>
        </Link>
      </nav>
    </header>
  )
}

export default Header
