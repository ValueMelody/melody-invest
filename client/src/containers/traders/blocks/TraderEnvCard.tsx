import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as selectors from 'selectors'
import { Badge, Card } from 'flowbite-react'
import UnwatchEnvButton from './UnwatchEnvButton'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

const TraderEnvCard = ({
  traderEnv,
  isActive = false,
  onClick,
  className,
}: {
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive?: boolean;
  onClick?: (envId: number) => void;
  className?: string;
}) => {
  // ------------------------------------------------------------ State --

  const user = useSelector(selectors.selectUser())

  const disabled = traderEnv && (
    !traderEnv.isSystem && !user.access.accessibleEnvIds.includes(traderEnv.id)
  )

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = () => {
    if (!traderEnv || !onClick) return
    onClick(traderEnv.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv) return null

  return (
    <Card
      data-testid='traderEnvCard'
      className={classNames(
        className,
        '[&>div]:p-4 [&>div]:gap-2',
        {
          'card-active': isActive,
          'card-disabled': disabled,
          'cursor-pointer': !disabled,
        },
      )}
      onClick={!disabled ? handleClickEnv : undefined}
    >
      <header className='flex justify-between'>
        <section>
          <h3 className='font-bold'>
            {localeTool.t('common.env')}: {parseTool.traderEnvName(traderEnv)}
          </h3>
          <h5 className='text-sm italic'>
            {parseTool.traderEnvStartDate(traderEnv)}
          </h5>
        </section>
        {traderEnv.isSystem && (
          <Badge
            color='gray'
            title={localeTool.t('traderEnv.systemDesc')}
          >
            {localeTool.t('common.system')}
          </Badge>
        )}
        {disabled && (
          <UnwatchEnvButton traderEnv={traderEnv} />
        )}
      </header>
      <h5 className='text-sm'>
        {disabled ? localeTool.t('permission.limited') : parseTool.traderEnvTickers(traderEnv)}
      </h5>
    </Card>
  )
}

export default TraderEnvCard
