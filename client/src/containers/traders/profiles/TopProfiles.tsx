import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Card } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'
import * as commonEnum from '../../../enums/common'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import ProfileCard from '../blocks/ProfileCard'

const TopProfiles = () => {
  const { classes: pageClasses } = usePageStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTopProfiles, fetchTopProfiles, getTraderProfile } = useTraderState()
  const [focusType, setFocusType] = useState('YEARLY')

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

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleClickOption = (type: string) => {
    setFocusType(type)
  }

  // ------------------------------------------------------------ Interface --

  if (!topProfiles || !focusedTop) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <section className='row-start'>
          {focusedTop.traders.map((traderId) => (
            <div key={traderId}>
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
              [pageClasses.activeCard]: option.type === focusType,
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
