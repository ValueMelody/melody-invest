import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'

const useStyles = vendorTool.jss.createUseStyles(({
  label: {
    alignSelf: 'flex-start',
  },
}))

const PatternLabel = ({
  patternId,
  traderEnv,
}: {
  patternId: number;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Interface --

  return (
    <vendorTool.ui.Label color='blue' className={classes.label}>
      {localeTool.t('common.profile')} #{patternId} - {traderEnv.name}
    </vendorTool.ui.Label>
  )
}

export default PatternLabel
