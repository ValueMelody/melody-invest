import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    alignSelf: 'flex-start',
  },
  label: {
    marginRight: '1rem !important',
  },
}))

const ProfileIdentity = ({
  trader,
  traderEnv,
}: {
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  const classes = useStyles()

  return (
    <div className={vendorTool.classNames('row-start', classes.container)}>
      <vendorTool.ui.Label color='blue' className={classes.label}>
        {parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('common.env')}
      </vendorTool.ui.Label>
      <h5>
        {localeTool.t('profile.estimatedAt', { date: trader.estimatedAt })}
      </h5>
    </div>
  )
}

export default ProfileIdentity
