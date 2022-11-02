import { useState, ChangeEvent, FormEvent } from 'react'
import ReactSelect, { MultiValue } from 'react-select'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput, Alert, ToggleSwitch, Select } from 'flowbite-react'
import DatePicker from 'react-datepicker'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import RequiredLabel from 'containers/elements/RequiredLabel'
import Info from 'containers/elements/Info'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'selectors'
import * as actions from 'actions'

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

const rowClass = 'flex items-center mb-6'
const leftClass = 'w-60 font-semibold flex items-center'
const rightClass = 'w-96'

const EnvBuilder = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [startYear, setStartYear] = useState('')
  const [startMonth, setStartMonth] = useState('01-01')
  const [tickerIds, setTickerIds] = useState<number[] | null>(null)
  const [envName, setEnvName] = useState('')

  const traderEnvs = useSelector(selectors.selectTraderEnvBases())

  const parsedEnvName = envName.trim().toLowerCase()
  const hasValidName = !!parsedEnvName
  const hasValidTickers = !tickerIds || !!tickerIds.length

  const tickerIdentities = useSelector(selectors.selectTickerIdentityBases())
  const selectableTickers = tickerIdentities.map((identity) => ({
    label: `${identity.name} (${identity.symbol})`,
    value: identity.id,
  }))

  const dateString = `${startYear}-${startMonth}`
  const date = startYear ? parseDateString(dateString) : null
  const selectedDate = date ? getDateFromString(date) : null

  const hasDuplicatedName = traderEnvs.some((env) => {
    const envName = parseTool.traderEnvName(env)
    return envName?.toLowerCase() === parsedEnvName
  })
  const hasDuplicatedEnv = traderEnvs.some((env) => {
    const currentIds = env.tickerIds ? env.tickerIds.join(',') : null
    const buildIds = tickerIds ? tickerIds.join(',') : null
    return dateString === env.startDate && currentIds === buildIds
  })

  const couldCreate = hasValidName && hasValidTickers && !hasDuplicatedName && !hasDuplicatedEnv

  const handleChangeStartYear = (date: Date | null) => {
    if (!date) return
    const selected = date.toISOString().slice(0, 4)
    setStartYear(selected)
  }

  const handleSelectStartMonth = (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    setStartMonth(typeof e.target.value === 'string' ? e.target.value : '')
  }

  const handleToggleAllTickers = () => {
    setTickerIds(tickerIds ? null : [])
  }

  const handleSelectTickers = (
    data: MultiValue<{ label: string; value: number; }>,
  ) => {
    setTickerIds(data.map((option) => option.value))
  }

  const handleChangeName = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEnvName(e.target.value)
  }

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    dispatch(actions.createTraderEnv({
      name: envName,
      startDate: `${startYear}-${startMonth}`,
      tickerIds,
    })).then((res: any) => {
      if (res?.payload?.id) {
        const link = routerTool.envDetailRoute(res.payload.id)
        navigate(link)
      }
    })
  }

  return (
    <section className='flex flex-col items-center'>
      <h1 className='builder-title'>
        {localeTool.t('envBuilder.title')}
      </h1>
      <section className={rowClass}>
        <RequiredLabel
          className={leftClass}
          tooltip={localeTool.t('envBuilder.startDateDesc')}
          title={localeTool.t('envBuilder.startDate')}
        />
        <div className={classNames('flex items-center', rightClass)}>
          <DatePicker
            className='mt-1 mr-4'
            minDate={minDate}
            maxDate={maxDate}
            selected={selectedDate}
            onChange={handleChangeStartYear}
            showYearPicker
            dateFormat='yyyy'
            customInput={<TextInput />}
          />
          <Select
            className='w-60'
            value={startMonth}
            onChange={handleSelectStartMonth}
          >
            {MonthOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.text}
              </option>
            ))}
          </Select>
        </div>
      </section>
      <section className={rowClass}>
        <h3 className={leftClass}>
          {localeTool.t('envBuilder.allTickers')}
          <Info title={localeTool.t('traderEnv.allTickers')} />
        </h3>
        <ToggleSwitch
          className={rightClass}
          checked={!tickerIds}
          onChange={handleToggleAllTickers}
          label=''
        />
      </section>
      {tickerIds && (
        <section className={rowClass}>
          <RequiredLabel
            className={leftClass}
            tooltip={localeTool.t('envBuilder.targetTickersDesc')}
            title={localeTool.t('envBuilder.targetTickers')}
          />
          <ReactSelect
            className={rightClass}
            value={selectableTickers.filter((ticker) => tickerIds.includes(ticker.value))}
            isMulti
            options={selectableTickers}
            isSearchable
            onChange={handleSelectTickers}
          />
        </section>
      )}
      <section className={rowClass}>
        <RequiredLabel
          className={leftClass}
          title={localeTool.t('envBuilder.name')}
        />
        <TextInput
          className={rightClass}
          value={envName}
          onChange={handleChangeName}
        />
      </section>
      {hasDuplicatedName && (
        <Alert
          color='failure'
          className='mb-4'
        >
          {localeTool.t('envBuilder.duplicatedName')}
        </Alert>
      )}
      {hasDuplicatedEnv && (
        <Alert
          color='failure'
          className='mb-4'
        >
          {localeTool.t('envBuilder.duplicatedEnv')}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <Button
            type='submit'
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
