import classNames from 'classnames'
import { Message, Menu, Header } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles(({
  gainCell: {
    padding: '0.5rem !important',
  },
}))

const ValueChangePercents = ({
  yearlyPercentNumber,
  pastYearPercentNumber,
  pastQuarterPercentNumber,
  pastMonthPercentNumber,
  pastWeekPercentNumber,
}: {
  yearlyPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const gainCellClass = classNames(commonClasses.columnCenter, classes.gainCell)

  const hasValue =
    yearlyPercentNumber ||
    pastYearPercentNumber ||
    pastQuarterPercentNumber ||
    pastMonthPercentNumber ||
    pastWeekPercentNumber

  // ------------------------------------------------------------ UI --

  if (!hasValue) {
    return (
      <Message compact>
        {localeTool.t('common.noResultYet')}
      </Message>
    )
  }

  return (
    <Menu compact data-testid='valueChangePercents'>
      <Menu.Item className={gainCellClass}>
        <Header as='h6'>
          {localeTool.t('gain.yearly')}:
        </Header>
        <Header as='h5'>
          {parseTool.dbPercentNumber(yearlyPercentNumber)}
        </Header>
      </Menu.Item>
      <Menu.Item className={gainCellClass}>
        <Header as='h6'>
          {localeTool.t('gain.pastYear')}:
        </Header>
        <Header as='h5'>
          {parseTool.dbPercentNumber(pastYearPercentNumber)}
        </Header>
      </Menu.Item>
      <Menu.Item className={gainCellClass}>
        <Header as='h6'>
          {localeTool.t('gain.pastQuarter')}:
        </Header>
        <Header as='h5'>
          {parseTool.dbPercentNumber(pastQuarterPercentNumber)}
        </Header>
      </Menu.Item>
      <Menu.Item className={gainCellClass}>
        <Header as='h6'>
          {localeTool.t('gain.pastMonth')}:
        </Header>
        <Header as='h5'>
          {parseTool.dbPercentNumber(pastMonthPercentNumber)}
        </Header>
      </Menu.Item>
      <Menu.Item className={gainCellClass}>
        <Header as='h6'>
          {localeTool.t('gain.pastWeek')}:
        </Header>
        <Header as='h5'>
          {parseTool.dbPercentNumber(pastWeekPercentNumber)}
        </Header>
      </Menu.Item>
    </Menu>
  )
}

export default ValueChangePercents
