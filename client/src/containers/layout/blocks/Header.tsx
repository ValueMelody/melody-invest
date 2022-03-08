import { Link } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Icon, Label } from 'semantic-ui-react'
import * as routerConstant from '../../../constants/router'
import * as themeConstant from '../../../constants/theme'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles((theme: themeConstant.THEME) => ({
  header: {
    height: 50,
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: theme.PRIMARY_COLOR,
    paddingLeft: theme.SPACING * 2,
    paddingRight: theme.SPACING * 2,
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <header className={classNames('row-between', classes.header)}>
      <nav>
        <Link to={routerConstant.NAV.TOP_PATTERNS}>
          <Label>
            <Icon name="chart line" />
            {localeTool.t('topPatterns.title')}
          </Label>
        </Link>
      </nav>
    </header>
  )
}

export default Header
