import { useNavigate } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import useTraderState from 'states/useTraderState'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderProfileCard from './TraderProfileCard'

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
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

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
          {localeTool.t('bestReturn.yearlyTitle')}:
        </h4>
        <TraderProfileCard
          profile={getTraderProfile(bestOverall)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastYearTitle')}:
        </h4>
        <TraderProfileCard
          profile={getTraderProfile(bestPastYear)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastQuarterTitle')}:
        </h4>
        <TraderProfileCard
          profile={getTraderProfile(bestPastQuarter)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastMonthTitle')}:
        </h4>
        <TraderProfileCard
          profile={getTraderProfile(bestPastMonth)}
          onClick={handleClickCard}
        />
      </div>
      <div className={classes.card}>
        <h4 className={classes.subTitle}>
          {localeTool.t('bestReturn.pastWeekTitle')}:
        </h4>
        <TraderProfileCard
          profile={getTraderProfile(bestPastWeek)}
          onClick={handleClickCard}
        />
      </div>
    </>
  )
}

export default EachTops
