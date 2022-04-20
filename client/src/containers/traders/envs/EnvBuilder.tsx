import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import RequiredLabel from '../../elements/RequiredLabel'
import useTickerState from '../../../states/useTickerState'
import useTraderState from '../../../states/useTraderState'

const useStyles = vendorTool.jss.createUseStyles(({
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
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()
  const { createTraderEnv } = useTraderState()

  const [startDate, setStartDate] = vendorTool.react.useState(constants.trader.initial.DATE)
  const [tickerIds, setTickerIds] = vendorTool.react.useState<number[] | null>(null)
  const [envName, setEnvName] = vendorTool.react.useState('')

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

  const handleSelectTickers = (
    e: vendorTool.react.SyntheticEvent,
    data: vendorTool.ui.DropdownProps,
  ) => {
    const values = Array.isArray(data.value) ? data.value : []
    setTickerIds(values.map((value) => Number(value)))
  }

  const handleChangeName = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setEnvName(e.target.value)
  }

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const result = await createTraderEnv(envName, startDate, tickerIds)
    if (result) {
      const link = routerTool.dashboardRoute()
      navigate(link)
    }
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='column-center'>
      <header className={vendorTool.classNames('row-around', classes.row)}>
        <h2>{localeTool.t('envBuilder.title')}</h2>
      </header>
      <section
        className={vendorTool.classNames('row-between', classes.row)}
        title={localeTool.t('envBuilder.startDateDesc')}
      >
        <h5><b>{localeTool.t('envBuilder.startDate')}:</b></h5>
        <div>
          <vendorTool.DatePicker
            minDate={minDate}
            selected={selectedDate}
            onChange={handleChangeStartDate}
            dateFormat='yyyy-MM-dd'
            customInput={<vendorTool.ui.Input />}
            showYearDropdown
          />
        </div>
      </section>
      <section
        className={vendorTool.classNames('row-between', classes.row)}
        title={localeTool.t('traderEnv.allTickers')}
      >
        <h5><b>{localeTool.t('envBuilder.allTickers')}:</b></h5>
        <vendorTool.ui.Checkbox
          toggle
          checked={!tickerIds}
          onChange={handleToggleAllTickers}
        />
      </section>
      {tickerIds && (
        <section
          className={vendorTool.classNames('row-between', classes.row)}
          title={localeTool.t('envBuilder.targetTickersDesc')}
        >
          <RequiredLabel title={localeTool.t('envBuilder.targetTickers')} />
          <vendorTool.ui.Dropdown
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
      <section className={vendorTool.classNames('row-between', classes.row)}>
        <RequiredLabel title={localeTool.t('envBuilder.name')} />
        <vendorTool.ui.Input
          value={envName}
          onChange={handleChangeName}
        />
      </section>
      <form onSubmit={handleSubmit}>
        <div className='row-around'>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={!hasValidName || !hasValidTickers}
          >
            {localeTool.t('common.confirmAndWatch')}
          </vendorTool.ui.Button>
        </div>
      </form>
    </section>
  )
}

export default EnvBuilder
