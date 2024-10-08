import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { Badge } from 'flowbite-react'

const ProfileLabel = ({
  trader,
  traderEnv,
  color,
  className,
}: {
  color: 'info' | 'gray';
  trader: interfaces.traderModel.Record;
  traderEnv: interfaces.traderEnvModel.Identity;
  className?: string;
}) => {
  return (
    <Badge
      size='sm'
      color={color}
      className={className}
      data-testid='profileLabel'
    >
      {
        parseTool.profileName(trader.traderPatternId)} - {traderEnv.name} {localeTool.t('entity.env')
      }
    </Badge>
  )
}

export default ProfileLabel
