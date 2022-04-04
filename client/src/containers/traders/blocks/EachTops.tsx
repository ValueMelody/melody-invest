import { createUseStyles } from 'react-jss'
import { Message } from 'semantic-ui-react'
import ProfileCard from './ProfileCard'
import useTraderState from '../../../states/useTraderState'
import * as localeTool from '../../../tools/locale'

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

  // ------------------------------------------------------------ State --

  const { getTraderProfile } = useTraderState()
  const hasResult = bestOverall || bestPastYear || bestPastQuarter || bestPastMonth || bestPastWeek

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
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastYearTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastYear)}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastQuarterTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastQuarter)}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastMonthTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastMonth)}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastWeekTitle')}:
        </h4>
        <ProfileCard
          profile={getTraderProfile(bestPastWeek)}
        />
      </div>
    </>
  )
}

export default EachTops
