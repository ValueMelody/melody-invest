import { Badge } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'

const ProfileLabel = ({
  trader,
  traderEnv,
  color,
}: {
  color: 'info' | 'gray';
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  return (
    <Badge
      size='sm'
      color={color}
      data-testid='profileLabel'
    >
      {parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('common.env')}
    </Badge>
  )
}

export default ProfileLabel
