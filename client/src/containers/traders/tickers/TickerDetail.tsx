import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import useTickerState from '../../../states/useTickerState'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import TickerLabel from '../elements/TickerLabel'
import TraderEnvCard from '../elements/TraderEnvCard'
import * as routerTool from '../../../tools/router'
import * as themeEnum from '../../../enums/theme'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  main: {
    alignItems: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    paddingBottom: '1.5rem',
  },
  left: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  right: {
    width: '28rem',
  },
}))

const TickerDetail = () => {
  const params = useParams()
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()
  const { getTraderEnv } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : null
  const envId = params.envId ? parseInt(params.envId) : 1

  const tickerIdentities = getTickerIdentities()
  const tickerIdentity = tickerIdentities.find((identity) => identity.id === tickerId) || null

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = (envId: number) => {
    if (!tickerId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  // ------------------------------------------------------------ Interface --

  if (!tickerIdentity) return null

  return (
    <section className={classNames('row-between', classes.main)}>
      <section className={classes.left}>
        <header className={classNames('row-start', classes.header)}>
          <TickerLabel ticker={tickerIdentity} color='grey' />
          <h4 className={classes.desc}>
            {tickerIdentity.name}
          </h4>
        </header>
      </section>
      <aside className={classes.right}>
        {user.userTraderEnvIds.map((traderEnvId) => (
          <TraderEnvCard
            key={traderEnvId}
            traderEnv={getTraderEnv(traderEnvId)}
            isActive={envId === traderEnvId}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default TickerDetail
