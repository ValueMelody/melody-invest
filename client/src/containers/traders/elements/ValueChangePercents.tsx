import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { Alert, Table } from 'flowbite-react'

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

  const hasValue =
    yearlyPercentNumber ||
    pastYearPercentNumber ||
    pastQuarterPercentNumber ||
    pastMonthPercentNumber ||
    pastWeekPercentNumber

  // ------------------------------------------------------------ UI --

  if (!hasValue) {
    return (
      <Alert color='info'>
        {localeTool.t('common.noResultYet')}
      </Alert>
    )
  }

  return (
    <Table data-testid='valueChangePercents'>
      <Table.Head>
        <Table.HeadCell>
          {localeTool.t('gain.yearly')}:
        </Table.HeadCell>
        <Table.HeadCell>
          {localeTool.t('gain.pastYear')}:
        </Table.HeadCell>
        <Table.HeadCell>
          {localeTool.t('gain.pastQuarter')}:
        </Table.HeadCell>
        <Table.HeadCell>
          {localeTool.t('gain.pastMonth')}:
        </Table.HeadCell>
        <Table.HeadCell>
          {localeTool.t('gain.pastWeek')}:
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            {parseTool.dbPercentNumber(yearlyPercentNumber)}
          </Table.Cell>
          <Table.Cell>
            {parseTool.dbPercentNumber(pastYearPercentNumber)}
          </Table.Cell>
          <Table.Cell>
            {parseTool.dbPercentNumber(pastQuarterPercentNumber)}
          </Table.Cell>
          <Table.Cell>
            {parseTool.dbPercentNumber(pastMonthPercentNumber)}
          </Table.Cell>
          <Table.Cell>
            {parseTool.dbPercentNumber(pastWeekPercentNumber)}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default ValueChangePercents
