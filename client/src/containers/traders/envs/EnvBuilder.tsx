import { useState, SyntheticEvent, ChangeEvent, FormEvent } from 'react'
import { Dropdown, DropdownProps, DropdownItemProps, Input, Message, Button, Checkbox } from 'semantic-ui-react'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import * as constants from '@shared/constants'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import useResourceState from 'states/useResourceState'
import useTraderState from 'states/useTraderState'
import useTraderRequest from 'requests/useTraderRequest'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'

const useStyles = createUseStyles(({
  row: {
    width: 620,
    marginBottom: '2rem',
  },
  confirmButton: {
    marginTop: '2rem !important',
  },
  input: {
    width: 420,
  },
  dropdown: {
    width: 200,
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

const getMaxYear = () => {
  const date = new Date()
  const year = date.getFullYear()
  return {
    year: year + 1, month: 6, day: 1,
  }
}

const MonthOptions = [
  { text: '01-01', value: '01-01' },
  { text: '06-01', value: '06-01' },
]

const initialDate = parseDateString(constants.Trader.Initial.Date)
const minDate = getDateFromString(initialDate)
const maxYear = getMaxYear()
const maxDate = getDateFromString(maxYear)

const EnvBuilder = () => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const { getTickerIdentities } = useResourceState()
  const { getTraderEnvs } = useTraderState()
  const { createTraderEnv } = useTraderRequest()

  const [startYear, setStartYear] = useState('')
  const [startMonth, setStartMonth] = useState('01-01')
  const [tickerIds, setTickerIds] = useState<number[] | null>(null)
  const [envName, setEnvName] = useState('')

  const traderEnvs = getTraderEnvs()

  const parsedEnvName = envName.trim().toLowerCase()
  const hasValidName = !!parsedEnvName
  const hasValidTickers = !tickerIds || !!tickerIds.length

  const tickerIdentities = getTickerIdentities()
  const selectableTickers = tickerIdentities.map((identity) => ({
    key: identity.id,
    text: identity.name,
    value: identity.id,
    symbol: identity.symbol,
  }))

  const dateString = `${startYear}-${startMonth}`
  const date = startYear ? parseDateString(dateString) : null
  const selectedDate = date ? getDateFromString(date) : null

  const hasDuplicatedName = traderEnvs.some((env) => env.record.name?.toLowerCase() === parsedEnvName)
  const hasDuplicatedEnv = traderEnvs.some((env) => {
    const currentIds = env.record.tickerIds ? env.record.tickerIds.join(',') : null
    const buildIds = tickerIds ? tickerIds.join(',') : null
    return dateString === env.record.startDate && currentIds === buildIds
  })

  const couldCreate = hasValidName && hasValidTickers && !hasDuplicatedName && !hasDuplicatedEnv

  // ------------------------------------------------------------ Handler --

  const handleChangeStartYear = (date: Date | null) => {
    if (!date) return
    const selected = date.toISOString().slice(0, 4)
    setStartYear(selected)
  }

  const handleSelectStartMonth = (
    e: SyntheticEvent,
    data: DropdownProps,
  ) => {
    setStartMonth(typeof data.value === 'string' ? data.value : '')
  }

  const handleToggleAllTickers = () => {
    setTickerIds(tickerIds ? null : [])
  }

  const handleSelectTickers = (
    e: SyntheticEvent,
    data: DropdownProps,
  ) => {
    const values = Array.isArray(data.value) ? data.value : []
    setTickerIds(values.map((value) => Number(value)))
  }

  const handleChangeName = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEnvName(e.target.value)
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    await createTraderEnv(envName, `${startYear}-${startMonth}`, tickerIds)
  }

  const handleSearch = (
    options: DropdownItemProps[],
    value: string,
  ) => {
    const formattedValue = value.trim().toUpperCase()
    return selectableTickers.filter((option) => {
      const label = option.text.toUpperCase()
      return label.includes(formattedValue) || option.symbol.includes(formattedValue)
    })
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className={commonClasses.columnCenter}>
      <header className={classNames(
        commonClasses.rowAround,
        classes.row,
      )}>
        <h2>{localeTool.t('envBuilder.title')}</h2>
      </header>
      <section
        className={classNames(
          commonClasses.rowBetween,
          classes.row,
        )}
        title={localeTool.t('envBuilder.startDateDesc')}
      >
        <h5><b>{localeTool.t('envBuilder.startDate')}:</b></h5>
        <div className={classNames(
          commonClasses.rowBetween,
          classes.input,
        )}>
          <div className={classes.dropdown}>
            <DatePicker
              minDate={minDate}
              maxDate={maxDate}
              selected={selectedDate}
              onChange={handleChangeStartYear}
              showYearPicker
              dateFormat='yyyy'
              customInput={<Input />}
              className={classes.dropdown}
            />
          </div>
          <Dropdown
            selection
            className={classes.dropdown}
            value={startMonth}
            onChange={handleSelectStartMonth}
            options={MonthOptions}
          />
        </div>
      </section>
      <section
        className={classNames(
          commonClasses.rowBetween,
          classes.row,
        )}
        title={localeTool.t('traderEnv.allTickers')}
      >
        <h5><b>{localeTool.t('envBuilder.allTickers')}:</b></h5>
        <Checkbox
          toggle
          checked={!tickerIds}
          onChange={handleToggleAllTickers}
        />
      </section>
      {tickerIds && (
        <section
          className={classNames(
            commonClasses.rowBetween,
            classes.row,
          )}
          title={localeTool.t('envBuilder.targetTickersDesc')}
        >
          <RequiredLabel title={localeTool.t('envBuilder.targetTickers')} />
          <Dropdown
            className={classes.input}
            multiple
            search={handleSearch}
            selection
            value={tickerIds}
            onChange={handleSelectTickers}
            options={selectableTickers}
          />
        </section>
      )}
      <section className={classNames(
        commonClasses.rowBetween,
        classes.row,
      )}>
        <RequiredLabel title={localeTool.t('envBuilder.name')} />
        <Input
          className={classes.input}
          value={envName}
          onChange={handleChangeName}
        />
      </section>
      {hasDuplicatedName && (
        <Message negative>
          {localeTool.t('envBuilder.duplicatedName')}
        </Message>
      )}
      {hasDuplicatedEnv && (
        <Message negative>
          {localeTool.t('envBuilder.duplicatedEnv')}
        </Message>
      )}
      <form onSubmit={handleSubmit}>
        <div className={commonClasses.rowAround}>
          <Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={!couldCreate}
          >
            {localeTool.t('common.confirmAndWatch')}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default EnvBuilder
