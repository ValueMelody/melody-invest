import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as routerTool from '../../../../tools/router'
import useTraderState from '../../../../states/useTraderState'
import ProfileCard from '../../blocks/ProfileCard'
import { FocusType } from '../../elements/TraderPerformance'

const useStyles = createUseStyles(({
  container: {
    marginBottom: '4rem !important',
  },
  section: {
    alignItems: 'flex-start',
  },
  card: {
    width: '28rem',
    margin: '0 1rem',
  },
  title: {
    marginLeft: '1rem !important',
    marginBottom: '1.5rem !important',
  },
}))

const TopProfileList = ({
  title,
  focusType,
  traderIds,
}: {
  title: string;
  focusType: FocusType;
  traderIds: number[];
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTraderProfile } = useTraderState()

  // ------------------------------------------------------------ Handler --

  const handleClick = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>{title}</h2>
      <section className={classNames('row-start', classes.section)} >
        {traderIds.map((traderId) => (
          <div key={traderId} className={classes.card}>
            <ProfileCard
              profile={getTraderProfile(traderId)}
              onClick={handleClick}
              focusType={focusType}
            />
          </div>
        ))}
      </section>
    </section>
  )
}

export default TopProfileList
