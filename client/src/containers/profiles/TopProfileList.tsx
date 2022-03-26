import { Segment } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as routerEnum from '../../enums/router'
import ProfileCard from './blocks/ProfileCard'
import { FocusType } from './elements/TraderPerformance'

const useStyles = createUseStyles(({
  section: {
    alignItems: 'flex-start',
  },
  title: {
    marginLeft: '1rem !important',
    marginBottom: '1rem !important',
  },
}))

const TopProfileList = ({
  title,
  focusType,
  profiles,
}: {
  title: string;
  focusType: FocusType;
  profiles: interfaces.traderProfileRes.TraderProfile[];
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
    <Segment>
      <h4 className={classes.title}><b>{title}</b></h4>
      <section className={classNames('row-start', classes.section)} >
        {profiles.map(({ trader, pattern }) => (
          <ProfileCard
            key={trader.id}
            trader={trader}
            pattern={pattern}
            onClick={handleClick}
            focusType={focusType}
          />
        ))}
      </section>
    </Segment>
  )
}

export default TopProfileList
