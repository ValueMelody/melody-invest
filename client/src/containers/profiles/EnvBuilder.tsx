import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Input, Checkbox } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as localeTool from '../../tools/locale'
import RequiredLabel from '../elements/RequiredLabel'

const useStyles = createUseStyles(({
  row: {
    width: 360,
    marginBottom: '2rem',
  },
}))

const parseDateString = (date: string): interfaces.common.Date => {
  const dateDetails = date.split('-').map((detail) => parseInt(detail))
  return { year: dateDetails[0], month: dateDetails[1], day: dateDetails[2] }
}

const getDateFromString = (date: interfaces.common.Date): Date => {
  return new Date(date.year, date.month - 1, date.day)
}

const initialDate = parseDateString(constants.time.initialDate)
const minDate = getDateFromString(initialDate)

const EnvBuilder = () => {
  const classes = useStyles()

  const [startDate, setStartDate] = useState(constants.time.initialDate)
  const [tickerIds, setTickerIds] = useState<number[] | null>(null)

  const date = parseDateString(startDate)
  const selectedDate = getDateFromString(date)

  const handleChangeStartDate = (date: Date | null) => {
    if (!date) return
    const selected = date.toISOString().slice(0, 10)
    setStartDate(selected)
  }

  const handleChangeTradeAllTickers = () => {
    setTickerIds(tickerIds ? null : [])
  }

  return (
    <section className='column-center'>
      <header className={classNames('row-around', classes.row)}>
        <h2>{localeTool.t('envBuilder.title')}</h2>
      </header>
      <section
        className={classNames('row-between', classes.row)}
        title={localeTool.t('envBuilder.startDateDesc')}
      >
        <h5><b>{localeTool.t('envBuilder.startDate')}:</b></h5>
        <div>
          <DatePicker
            minDate={minDate}
            selected={selectedDate}
            onChange={handleChangeStartDate}
            dateFormat='yyyy-MM-dd'
            customInput={<Input />}
            showYearDropdown
          />
        </div>
      </section>
      <section
        className={classNames('row-between', classes.row)}
        title={localeTool.t('traderEnv.allTickers')}
      >
        <h5><b>{localeTool.t('envBuilder.allTickers')}:</b></h5>
        <Checkbox toggle checked={!tickerIds} onChange={handleChangeTradeAllTickers} />
      </section>
      <section
        className={classNames('row-between', classes.row)}
        title={localeTool.t('envBuilder.targetTickersDesc')}
      >
        <RequiredLabel title={localeTool.t('envBuilder.targetTickers')} />
      </section>
    </section>
  )
}

export default EnvBuilder
