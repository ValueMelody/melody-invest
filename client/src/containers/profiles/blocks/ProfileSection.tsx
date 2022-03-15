import { Segment, Header } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as routerConstant from '../../../constants/router'
import TraderStats, { FocusType } from './TraderStats'

const useStyles = createUseStyles(({
  section: {
    alignItems: 'flex-start',
  },
}))

const ProfileSection = ({
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
    const link = `${routerConstant.NAVS.PROFILES}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  return (
    <Segment>
      <Header as='h4'>{title}</Header>
      <section className={classNames('row-between', classes.section)} >
        {traderWithPatterns.map(({ trader, pattern }) => (
          <TraderStats
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

export default ProfileSection
