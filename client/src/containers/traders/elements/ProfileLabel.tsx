import { Badge } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'

const ProfileLabel = ({
  trader,
  traderEnv,
  color,
  className,
}: {
  color: 'info' | 'gray';
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Record;
  className?: string
}) => {
  return (
    <Badge
      size='sm'
      color={color}
      className={className}
      data-testid='profileLabel'
    >
      {parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('common.env')}
    </Badge>
  )
}

export default ProfileLabel
