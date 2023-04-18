import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import ProfileLabel from './ProfileLabel'
import ValueDiffer from './ValueDiffer'
import classNames from 'classnames'

const ProfileValue = ({
  trader,
  env,
  onClick,
  className,
}: {
  trader: interfaces.traderModel.Record | null;
  env: interfaces.traderEnvModel.Identity | null;
  onClick?: (trader: interfaces.traderModel.Record) => void;
  className?: string;
}) => {
  const handleClick = () => {
    if (!trader || !onClick) return
    onClick(trader)
  }

  if (!trader || !env) return null

  return (
    <section
      data-testid='profileValue'
      className={classNames(
        'flex justify-around',
        className,
        { 'cursor-pointer': !!onClick },
      )}
      onClick={handleClick}
    >
      <ProfileLabel
        color='gray'
        className='mr-2'
        trader={trader}
        traderEnv={env}
      />
      <ValueDiffer
        title=''
        currentValue={trader.totalValue || constants.Trader.Initial.Cash}
        compareValue={constants.Trader.Initial.Cash}
      />
    </section>
  )
}

export default ProfileValue
