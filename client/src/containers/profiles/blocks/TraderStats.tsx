import { Segment, Header, Label, Menu } from 'semantic-ui-react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as themeConstant from '../../../constants/theme'
import PatternBehaviors from '../elements/Patternbehaviors'

const useStyles = createUseStyles((theme: themeConstant.Theme) => ({
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

const FOCUS_TYPE = {
  YEARLY: 'YEARLY',
  PAST_YEAR: 'PAST_YEAR',
  PAST_QUARTER: 'PAST_QUARTER',
  PAST_MONTH: 'PAST_MONTH',
  PAST_WEEK: 'PAST_WEEK',
} as const
type FocusTypeKeys = keyof typeof FOCUS_TYPE
export type FocusType = typeof FOCUS_TYPE[FocusTypeKeys]

const TraderStats = ({
  trader,
  pattern,
  focusType,
  onClick,
}: {
  trader: interfaces.traderModel.Record;
  pattern: interfaces.traderPatternModel.Public;
  focusType?: FocusType;
  onClick?: (record: interfaces.traderModel.Record) => void;
}) => {
  const classes = useStyles()
  const gainCellClass = classNames('column-center', classes.gainCell)

  const handleClick = () => {
    if (!onClick) return
    return onClick(trader)
  }

  return (
    <Segment
      className={classNames('row-around', classes.pattern, {
        'click-cursor': !!onClick,
      })}
      onClick={handleClick}
      padded
    >
      <Label attached='top left' color='blue'>
        {localeTool.t('common.pattern')}: #{trader.traderPatternId}
      </Label>
      <Menu compact>
        <Menu.Item className={classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.YEARLY,
        })}>
          <Header as='h6'>
            {localeTool.t('gain.yearly')}:
          </Header>
          <Header as='h5'>
            {parseTool.dbPercentNumber(trader.yearlyPercentNumber)}
          </Header>
        </Menu.Item>
        <Menu.Item className={classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_YEAR,
        })}>
          <Header as='h6'>
            {localeTool.t('gain.pastYear')}:
          </Header>
          <Header as='h5'>
            {parseTool.dbPercentNumber(trader.pastYearPercentNumber)}
          </Header>
        </Menu.Item>
        <Menu.Item className={classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_QUARTER,
        })}>
          <Header as='h6'>
            {localeTool.t('gain.pastQuarter')}:
          </Header>
          <Header as='h5'>
            {parseTool.dbPercentNumber(trader.pastQuarterPercentNumber)}
          </Header>
        </Menu.Item>
        <Menu.Item className={classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_MONTH,
        })}>
          <Header as='h6'>
            {localeTool.t('gain.pastMonth')}:
          </Header>
          <Header as='h5'>
            {parseTool.dbPercentNumber(trader.pastMonthPercentNumber)}
          </Header>
        </Menu.Item>
        <Menu.Item className={classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_WEEK,
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
  )
}

export default TraderStats
