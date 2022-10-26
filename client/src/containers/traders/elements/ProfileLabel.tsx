import { Label, SemanticCOLORS } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'

const ProfileLabel = ({
  trader,
  traderEnv,
  color,
}: {
  color: SemanticCOLORS;
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  return (
    <Label
      color={color}
      data-testid='profileLabel'
    >
      {parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('common.env')}
    </Label>
  )
}

export default ProfileLabel
