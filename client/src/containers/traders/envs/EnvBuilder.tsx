import { useState, SyntheticEvent, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { Input, Checkbox, Dropdown, DropdownProps, Button } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import RequiredLabel from '../../elements/RequiredLabel'
import useTickerState from '../../../states/useTickerState'
import useTraderState from '../../../states/useTraderState'

const useStyles = createUseStyles(({
  row: {
    width: 400,
    marginBottom: '2rem',
  },
  confirmButton: {
    marginTop: '2rem !important',
  },
  dropdown: {
    width: 205,
  },
}))

interface PlainDate {
  year: number;
  month: number;
  day: number;
}

const parseDateString = (date: string): PlainDate => {
  const dateDetails = date.split('-').map((detail) => parseInt(detail))
  return { year: dateDetails[0], month: dateDetails[1], day: dateDetails[2] }
}

const getDateFromString = (date: PlainDate): Date => {
  return new Date(date.year, date.month - 1, date.day)
}

const initialDate = parseDateString(constants.trader.initial.DATE)
const minDate = getDateFromString(initialDate)

const EnvBuilder = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()
  const { createTraderEnv } = useTraderState()

  const [startDate, setStartDate] = useState(constants.trader.initial.DATE)
  const [tickerIds, setTickerIds] = useState<number[] | null>(null)
  const [envName, setEnvName] = useState('')

  const hasValidName = !!envName.trim()
  const hasValidTickers = !tickerIds || !!tickerIds.length

  const tickerIdentities = getTickerIdentities()
  const selectableTickers = tickerIdentities.map((identity) => ({
    key: identity.id,
    text: identity.name,
    value: identity.id,
  }))

  const date = parseDateString(startDate)
  const selectedDate = getDateFromString(date)

  // ------------------------------------------------------------ Handler --

  const handleChangeStartDate = (date: Date | null) => {
    if (!date) return
    const selected = date.toISOString().slice(0, 10)
    setStartDate(selected)
  }

  const handleToggleAllTickers = () => {
    setTickerIds(tickerIds ? null : [])
  }

  const handleSelectTickers = (e: SyntheticEvent, data: DropdownProps) => {
    const values = Array.isArray(data.value) ? data.value : []
    setTickerIds(values.map((value) => Number(value)))
  }

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setEnvName(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await createTraderEnv(envName, startDate, tickerIds)
    if (result) {
      const link = routerTool.dashboardRoute()
      navigate(link)
    }
  }

  // ------------------------------------------------------------ Interface --

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
        <Checkbox toggle checked={!tickerIds} onChange={handleToggleAllTickers} />
      </section>
      {tickerIds && (
        <section
          className={classNames('row-between', classes.row)}
          title={localeTool.t('envBuilder.targetTickersDesc')}
        >
          <RequiredLabel title={localeTool.t('envBuilder.targetTickers')} />
          <Dropdown
            className={classes.dropdown}
            multiple
            search
            selection
            value={tickerIds}
            onChange={handleSelectTickers}
            options={selectableTickers}
          />
        </section>
      )}
      <section className={classNames('row-between', classes.row)}>
        <RequiredLabel title={localeTool.t('envBuilder.name')} />
        <Input value={envName} onChange={handleChangeName} />
      </section>
      <form onSubmit={handleSubmit}>
        <div className='row-around'>
          <Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={!hasValidName || !hasValidTickers}
          >
            {localeTool.t('envBuilder.confirm')}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default EnvBuilder
