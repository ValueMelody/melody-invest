import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as constants from '@shared/constants'
import useUserState from '../../../states/useUserState'
import TraderComboCard from '../elements/TraderComboCard'
import HoldingCard from '../blocks/HoldingCard'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  right: {
    width: '28rem',
  },
}))

const TopCombos = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()
  const systemCombos = user.userTraderCombos.filter((combo) => combo.isSysten)
  const firstCombo = systemCombos[0]

  // ------------------------------------------------------------ Interface --

  if (!systemCombos.length) return null

  return (
    <section className={classNames('row-between', classes.container)}>
      <section className={classes.left}>
        {firstCombo.holdingDetails.map((detail, index) => (
          <HoldingCard
            key={detail.date}
            holding={detail}
            previousHolding={index + 1 < firstCombo.holdingDetails.length ? firstCombo.holdingDetails[index + 1] : null}
            initialValue={constants.trader.initial.CASH * 10}
          />
        ))}
      </section>
      <section className={classes.right}>
        {systemCombos.map((combo) => {
          const env = user.userTraderEnvs.find((env) => env.id === combo.traderEnvId) || null
          return (
            <TraderComboCard
              key={combo.id}
              traderCombo={combo}
              traderEnv={env}
              isActive={false}
            />
          )
        })}
      </section>
    </section>
  )
}

export default TopCombos
