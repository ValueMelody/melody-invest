import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'
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
  const classes = useStyles()

  // ------------------------------------------------------------ handler --
  const handleClick = () => {
    if (!trader || !onClick) return
    onClick(trader)
  }

  // ------------------------------------------------------------ UI --
  if (!trader || !env) return null

  return (
    <div
      className={vendorTool.classNames('row-start', classes.container, {
        'click-cursor': !!onClick,
      })}
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
