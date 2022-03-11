import { Segment, Header, Label, Menu } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as routerConstant from '../../../constants/router'
import * as themeConstant from '../../../constants/theme'
import PatternBehaviors from '../elements/Patternbehaviors'

const useStyles = createUseStyles((theme: themeConstant.Theme) => ({
  section: {
    alignItems: 'flex-start',
  },
  pattern: {
    width: '32%',
    marginTop: '0 !important',
    marginBottom: '1rem !important',
    minWidth: '28rem',
  },
  gainCell: {
    padding: '0.5rem !important',
  },
  focusCell: {
    border: `1px solid ${theme.PRIMARY_COLOR}`,
  },
}))

export const GAIN_TYPE = {
  YEARLY: 'YEARLY',
  PAST_YEAR: 'PAST_YEAR',
  PAST_QUARTER: 'PAST_QUARTER',
  PAST_MONTH: 'PAST_MONTH',
  PAST_WEEK: 'PAST_WEEK',
}

const PatternsSection = ({
  title,
  gainType,
  traderWithPatterns,
}: {
  title: string;
  gainType: string;
  traderWithPatterns: interfaces.resourcesResponse.TraderWithPattern[];
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const gainCellClass = classNames('column-center', classes.gainCell)

  const handleClick = (
    trader: interfaces.traderModel.Record,
  ) => {
    const link = `${routerConstant.NAV.PATTERNS}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  return (
    <Segment>
      <Header as='h4'>{title}</Header>
      <section className={classNames('row-between', classes.section)} >
        {traderWithPatterns.map(({ trader, pattern }) => (
          <Segment
            key={trader.id}
            className={classNames('row-around', 'click-cursor', classes.pattern)}
            onClick={() => handleClick(trader)}
            padded
          >
            <Label attached='top left' color='blue'>
              {localeTool.t('common.pattern')}: #{pattern.id}
            </Label>
            <Menu compact>
              <Menu.Item className={classNames(gainCellClass, {
                [classes.focusCell]: gainType === GAIN_TYPE.YEARLY,
              })}>
                <Header as='h6'>
                  {localeTool.t('gain.yearly')}:
                </Header>
                <Header as='h5'>
                  {parseTool.dbPercentNumber(trader.yearlyPercentNumber)}
                </Header>
              </Menu.Item>
              <Menu.Item className={classNames(gainCellClass, {
                [classes.focusCell]: gainType === GAIN_TYPE.PAST_YEAR,
              })}>
                <Header as='h6'>
                  {localeTool.t('gain.pastYear')}:
                </Header>
                <Header as='h5'>
                  {parseTool.dbPercentNumber(trader.pastYearPercentNumber)}
                </Header>
              </Menu.Item>
              <Menu.Item className={classNames(gainCellClass, {
                [classes.focusCell]: gainType === GAIN_TYPE.PAST_QUARTER,
              })}>
                <Header as='h6'>
                  {localeTool.t('gain.pastQuarter')}:
                </Header>
                <Header as='h5'>
                  {parseTool.dbPercentNumber(trader.pastQuarterPercentNumber)}
                </Header>
              </Menu.Item>
              <Menu.Item className={classNames(gainCellClass, {
                [classes.focusCell]: gainType === GAIN_TYPE.PAST_MONTH,
              })}>
                <Header as='h6'>
                  {localeTool.t('gain.pastMonth')}:
                </Header>
                <Header as='h5'>
                  {parseTool.dbPercentNumber(trader.pastMonthPercentNumber)}
                </Header>
              </Menu.Item>
              <Menu.Item className={classNames(gainCellClass, {
                [classes.focusCell]: gainType === GAIN_TYPE.PAST_WEEK,
              })}>
                <Header as='h6'>
                  {localeTool.t('gain.pastWeek')}:
                </Header>
                <Header as='h5'>
                  {parseTool.dbPercentNumber(trader.pastWeekPercentNumber)}
                </Header>
              </Menu.Item>
            </Menu>
            <PatternBehaviors pattern={pattern} />
          </Segment>
        ))}
      </section>
    </Segment>
  )
}

export default PatternsSection
