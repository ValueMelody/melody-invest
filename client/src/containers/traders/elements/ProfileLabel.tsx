import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'

const ProfileLabel = ({
  trader,
  traderEnv,
  color,
}: {
  color: vendorTool.ui.SemanticCOLORS;
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  return (
    <vendorTool.ui.Label color={color} data-testid='profileLabel'>
      {parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('common.env')}
    </vendorTool.ui.Label>
  )
}

export default ProfileLabel
