import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Card } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'
import * as commonEnum from '../../../enums/common'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import ProfileCard from '../blocks/ProfileCard'
import { FocusType } from '../elements/TraderPerformance'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  cards: {
    width: '100%',
    alignItems: 'flex-start',
  },
  card: {
    width: '28rem',
    margin: '0 1rem',
  },
  isActive: {
    border: `3px solid ${theme.PRIMARY_COLOR} !important`,
  },
}))

const TopProfiles = () => {
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTopProfiles, fetchTopProfiles, getTraderProfile } = useTraderState()
  const [focusType, setFocusType] = useState<FocusType>('YEARLY')

  const topProfiles = getTopProfiles(commonEnum.OVERALL_ENV_ID)

  const topOptions = [
    {
      type: 'YEARLY',
      title: localeTool.t('bestReturn.yearlyTitle'),
      traders: topProfiles?.yearly || [],
    },
    {
      type: 'PAST_YEAR',
      title: localeTool.t('bestReturn.pastYearTitle'),
      traders: topProfiles?.pastYear || [],
    },
    {
      type: 'PAST_QUARTER',
      title: localeTool.t('bestReturn.pastQuarterTitle'),
      traders: topProfiles?.pastQuarter || [],
    },
    {
      type: 'PAST_MONTH',
      title: localeTool.t('bestReturn.pastMonthTitle'),
      traders: topProfiles?.pastMonth || [],
    },
    {
      type: 'PAST_WEEK',
      title: localeTool.t('bestReturn.pastWeekTitle'),
      traders: topProfiles?.pastWeek || [],
    },
  ]

  const focusedTop = topOptions.find((option) => option.type === focusType)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (topProfiles) return
    fetchTopProfiles(commonEnum.OVERALL_ENV_ID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProfiles])

  const handleClickProfile = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleClickOption = (type: FocusType) => {
    setFocusType(type)
  }

  // ------------------------------------------------------------ Interface --

  if (!topProfiles || !focusedTop) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <section className={classNames('row-start', classes.cards)}>
          {focusedTop.traders.map((traderId) => (
            <div key={traderId} className={classes.card}>
              <ProfileCard
                profile={getTraderProfile(traderId)}
                onClick={handleClickProfile}
                focusType={focusType}
              />
            </div>
          ))}
        </section>
      </section>
      <aside className={pageClasses.aside}>
        <h2>{localeTool.t('bestReturn.type')}:</h2>
        {topOptions.map((option) => (
          <Card
            key={option.type}
            className={classNames({
              [classes.isActive]: option.type === focusType,
            })}
            header={option.title}
            onClick={() => handleClickOption(option.type)}
          />
        ))}
      </aside>
    </section>
  )
}

export default TopProfiles
