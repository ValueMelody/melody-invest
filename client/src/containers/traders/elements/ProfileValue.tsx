import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as vendorTool from 'tools/vendor'
import useCommonStyle from 'styles/useCommonStyle'
import ProfileLabel from './ProfileLabel'
import ValueDiffer from './ValueDiffer'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    marginBottom: '1rem',
  },
}))

const ProfileValue = ({
  trader,
  env,
  onClick,
}: {
  trader: interfaces.traderModel.Record | null;
  env: interfaces.traderEnvModel.Record | null;
  onClick?: (trader: interfaces.traderModel.Record) => void;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  // ------------------------------------------------------------ Handler --
  const handleClick = () => {
    if (!trader || !onClick) return
    onClick(trader)
  }

  // ------------------------------------------------------------ UI --
  if (!trader || !env) return null

  return (
    <div
      className={vendorTool.classNames(
        commonClasses.rowStart,
        classes.container,
        { [commonClasses.cursorClickable]: !!onClick },
      )}
      onClick={handleClick}
    >
      <ProfileLabel
        color='grey'
        trader={trader}
        traderEnv={env}
      />
      <ValueDiffer
        title=''
        currentValue={trader.totalValue || constants.Trader.Initial.Cash}
        compareValue={constants.Trader.Initial.Cash}
      />
    </div>
  )
}

export default ProfileValue
