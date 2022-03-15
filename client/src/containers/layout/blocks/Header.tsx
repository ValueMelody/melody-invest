import { Link } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Icon, Label } from 'semantic-ui-react'
import * as routerConstant from '../../../constants/router'
import * as themeConstant from '../../../constants/theme'
import * as localeTool from '../../../tools/locale'

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
  icon: {
    marginRight: '0.5rem !important',
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <header className={classNames('row-between', classes.header)}>
      <nav>
        <Link to={routerConstant.NAV.TOP_PROFILES}>
          <Label>
            <Icon name='chart line' className={classes.icon} />
            {localeTool.t('top.title')}
          </Label>
        </Link>
      </nav>
      <nav>
        <Link to={routerConstant.NAV.SIGNUP}>
          <Label>
            <Icon name='user circle' />
          </Label>
        </Link>
      </nav>
    </header>
  )
}

export default Header
