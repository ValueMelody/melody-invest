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
  const hasValue =
    yearlyPercentNumber ||
    pastYearPercentNumber ||
    pastQuarterPercentNumber ||
    pastMonthPercentNumber ||
    pastWeekPercentNumber

  if (!hasValue) {
    return (
      <Alert color='info'>
        {localeTool.t('valueChange.noResultYet')}
      </Alert>
    )
  }

  return (
    <section className='flex flex-col overflow-x-auto'>
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
            <Table.Cell data-testid='yearlyNumber'>
              {parseTool.dbPercentNumber(yearlyPercentNumber)}
            </Table.Cell>
            <Table.Cell data-testid='pastYearNumber'>
              {parseTool.dbPercentNumber(pastYearPercentNumber)}
            </Table.Cell>
            <Table.Cell data-testid='pastQuarterNumber'>
              {parseTool.dbPercentNumber(pastQuarterPercentNumber)}
            </Table.Cell>
            <Table.Cell data-testid='pastMonthNumber'>
              {parseTool.dbPercentNumber(pastMonthPercentNumber)}
            </Table.Cell>
            <Table.Cell data-testid='pastWeekNumber'>
              {parseTool.dbPercentNumber(pastWeekPercentNumber)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <h3 className='mt-2'>{localeTool.t('valueChange.return')}</h3>
    </section>
  )
}

export default ValueChangePercents
