import { useMemo } from 'react'
import { Segment, Header, Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as themeConstant from '../../../constants/theme'

const useStyles = createUseStyles((theme: themeConstant.THEME) => ({
  pattern: {
    width: '30%',
    marginTop: '0 !important',
    marginBottom: `${theme.SPACING}px !important`,
    minWidth: 300,
  },
}))

const PatternsSection = ({
  gainType,
  patterns,
}: {
  gainType: 'YEARLY' | 'PAST_YEAR' | 'PAST_QUARTER' | 'PAST_MONTH' | 'PAST_WEEK';
  patterns: interfaces.patternsResponse.TraderWithPattern[];
}) => {
  const classes = useStyles()

  const title = useMemo(() => {
    switch (gainType) {
      case 'YEARLY':
        return localeTool.t('topPatterns.titleYearly')
      case 'PAST_YEAR':
        return localeTool.t('topPatterns.titlePastYear')
      case 'PAST_QUARTER':
        return localeTool.t('topPatterns.titlePastQuarter')
      case 'PAST_MONTH':
        return localeTool.t('topPatterns.titlePastMonth')
      case 'PAST_WEEK':
        return localeTool.t('topPatterns.titlePastWeek')
      default:
        throw new Error()
    }
  }, [gainType])

  const gainTitle = useMemo(() => {
    switch (gainType) {
      case 'YEARLY':
        return localeTool.t('gain.yearly')
      case 'PAST_YEAR':
        return localeTool.t('gain.pastYear')
      case 'PAST_QUARTER':
        return localeTool.t('gain.pastQuarter')
      case 'PAST_MONTH':
        return localeTool.t('gain.pastMonth')
      case 'PAST_WEEK':
        return localeTool.t('gain.pastWeek')
      default:
        throw new Error()
    }
  }, [gainType])

  const gainKey = useMemo(() => {
    switch (gainType) {
      case 'YEARLY':
        return 'yearlyPercentNumber'
      case 'PAST_YEAR':
        return 'pastYearPercentNumber'
      case 'PAST_QUARTER':
        return 'pastQuarterPercentNumber'
      case 'PAST_MONTH':
        return 'pastMonthPercentNumber'
      case 'PAST_WEEK':
        return 'pastWeekPercentNumber'
      default:
        throw new Error()
    }
  }, [gainType])

  return (
    <Segment>
      <Header as="h4">{title}</Header>
      <section className="row-between">
        {patterns.map((pattern) => (
          <Segment className={classes.pattern} key={pattern.trader.id} padded>
            <Label attached="top left">
              #{pattern.pattern.id}&nbsp;
              {gainTitle}:&nbsp;
              {parseTool.percentNumber(pattern.trader[gainKey])}
            </Label>
          </Segment>
        ))}
      </section>
    </Segment>
  )
}

export default PatternsSection
