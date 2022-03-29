import { Segment } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as routerEnum from '../../enums/router'
import ProfileCard from './blocks/ProfileCard'
import { FocusType } from './elements/TraderPerformance'

const useStyles = createUseStyles(({
  container: {
    marginBottom: '4rem !important',
  },
  section: {
    alignItems: 'flex-start',
  },
  card: {
    width: '26rem',
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
  profiles,
}: {
  title: string;
  focusType: FocusType;
  profiles: interfaces.traderRes.TraderProfile[];
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const handleClick = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = `${routerEnum.NAV.PROFILES}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  return (
    <Segment className={classes.container}>
      <h2 className={classes.title}>{title}</h2>
      <section className={classNames('row-start', classes.section)} >
        {profiles.map(({ trader, pattern }) => (
          <div key={trader.id} className={classes.card}>
            <ProfileCard
              trader={trader}
              pattern={pattern}
              onClick={handleClick}
              focusType={focusType}
            />
          </div>
        ))}
      </section>
    </Segment>
  )
}

export default TopProfileList
