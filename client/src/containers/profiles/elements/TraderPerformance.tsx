import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Menu, Header, Message } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as themeEnum from '../../../enums/theme'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
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

const TraderPerformance = ({
  trader,
  focusType,
}: {
  trader: interfaces.traderModel.Record;
  focusType?: FocusType;
}) => {
  const classes = useStyles()
  const gainCellClass = classNames('column-center', classes.gainCell)

  if (!trader.estimatedAt) {
    return <Message compact>{localeTool.t('profile.noResultYet')}</Message>
  }

  return (
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
  )
}

export default TraderPerformance
