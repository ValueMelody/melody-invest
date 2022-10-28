import classNames from 'classnames'
import { Badge, Card } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useUserState from 'states/useUserState'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import UnwatchEnvButton from './UnwatchEnvButton'

const TraderEnvCard = ({
  traderEnv,
  isActive = false,
  onClick,
}: {
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive?: boolean;
  onClick?: (envId: number) => void;
}) => {
  // ------------------------------------------------------------ State --

  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

  const { getUser } = useUserState()
  const user = getUser()

  const disabled = traderEnv && (
    !traderEnv.isSystem && !user.accessibleEnvIds.includes(traderEnv.id)
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
      className={classNames(cardClasses.container, {
        [cardClasses.isActive]: isActive,
        [cardClasses.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickEnv : undefined}
    >
      <header className={commonClasses.rowBetween}>
        <b>{localeTool.t('common.env')}: {traderEnv.name}</b>
        {traderEnv.isSystem && (
          <Badge color='gray' title={localeTool.t('traderEnv.systemDesc')}>
            {localeTool.t('common.system')}
          </Badge>
        )}
        {disabled && (
          <UnwatchEnvButton traderEnv={traderEnv} />
        )}
      </header>
      <h5>{parseTool.traderEnvStartDate(traderEnv)}</h5>
      <h5>{disabled ? localeTool.t('permission.limited') : parseTool.traderEnvTickers(traderEnv)}</h5>
    </Card>
  )
}

export default TraderEnvCard
