import { Segment, Header } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as routerConstant from '../../../constants/router'
import ProfileCard from './ProfileCard'
import { FocusType } from '../../../components/TraderPerformance'

const useStyles = createUseStyles(({
  section: {
    alignItems: 'flex-start',
  },
}))

const ProfileList = ({
  title,
  focusType,
  traderWithPatterns,
}: {
  title: string;
  focusType: FocusType;
  traderWithPatterns: interfaces.traderProfileRes.TraderProfile[];
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const handleClick = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = `${routerConstant.NAV.PROFILES}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  return (
    <Segment>
      <Header as='h4'>{title}</Header>
      <section className={classNames('row-between', classes.section)} >
        {traderWithPatterns.map(({ trader, pattern }) => (
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

export default ProfileList
