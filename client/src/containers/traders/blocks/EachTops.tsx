import { createUseStyles } from 'react-jss'
import { Message } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { useNavigate } from 'react-router-dom'
import ProfileCard from './ProfileCard'
import useTraderState from '../../../states/useTraderState'
import * as localeTool from '../../../tools/locale'
import * as routerEnum from '../../../enums/router'

const useStyles = createUseStyles(({
  card: {
    width: '28rem',
    margin: '1rem',
  },
  subTitle: {
    marginBottom: '1rem !important',
  },
  noResult: {
    marginTop: '1rem !important',
  },
}))

const EachTops = ({
  bestOverall,
  bestPastYear,
  bestPastQuarter,
  bestPastMonth,
  bestPastWeek,
}: {
  bestOverall: number | null,
  bestPastYear: number | null,
  bestPastQuarter: number | null,
  bestPastMonth: number | null,
  bestPastWeek: number | null,
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTraderProfile } = useTraderState()
  const hasResult = bestOverall || bestPastYear || bestPastQuarter || bestPastMonth || bestPastWeek

  // ------------------------------------------------------------ Handler --

  const handleClickCard = (trader: interfaces.traderModel.Record) => {
    const link = `${routerEnum.NAV.TRADERS}/profiles/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!hasResult) {
    return (
      <Message compact className={classes.noResult}>
        {localeTool.t('traderEnv.noResultYet')}
      </Message>
    )
  }

  return (
    <>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.yearlyTitle')}
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestOverall)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastYearTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastYear)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastQuarterTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastQuarter)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastMonthTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastMonth)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastWeekTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastWeek)}
          onClick={handleClickCard}
        />
      </div>
    </>
  )
}

export default EachTops
