import { Link } from 'react-router-dom'
import { Icon, Label } from 'semantic-ui-react'
import * as routerConstant from '../../../constants/router'
import * as localeTool from '../../../tools/locale'

const Header = () => {
  return (
    <nav>
      <Link to={routerConstant.NAV.TOP_TRADERS}>
        <Label>
          <Icon name="chart line" />
          {localeTool.t('topTraders.title')}
        </Label>
      </Link>
    </nav>
  )
}

export default Header
