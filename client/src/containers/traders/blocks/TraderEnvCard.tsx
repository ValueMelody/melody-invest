import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as selectors from 'selectors'
import { Card } from 'flowbite-react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import UnwatchEnvButton from './UnwatchEnvButton'

const TraderEnvCard = ({
  traderEnv,
  isActive = false,
  onClick,
  className,
}: {
  traderEnv: interfaces.traderEnvModel.Identity | null;
  isActive?: boolean;
  onClick?: (envId: number) => void;
  className?: string;
}) => {
  const user = useSelector(selectors.selectUser())

  const disabled = traderEnv && !user.access.accessibleEnvIds.includes(traderEnv.id)

  const handleClickEnv = () => {
    if (!traderEnv || !onClick) return
    onClick(traderEnv.id)
  }

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
            {localeTool.t('entity.env')}: {traderEnv.name}
          </h3>
          <h5 className='text-sm italic'>
            {parseTool.traderEnvStartDate(traderEnv)}
          </h5>
        </section>
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
