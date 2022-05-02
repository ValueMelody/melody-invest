import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import RequiredLabel from '../../elements/RequiredLabel'
import TraderProfileCard from '../blocks/TraderProfileCard'
import usePrivateGuard from '../../hooks/usePrivateGuard'

const useStyles = vendorTool.jss.createUseStyles(({
  row: {
    width: 400,
    marginBottom: '2rem',
  },
  profileTitle: {
    marginTop: '2rem !important',
    marginBottom: '2rem !important',
  },
  confirmButton: {
    marginTop: '2rem !important',
  },
  warningMsg: {
    marginBottom: '2rem !important',
  },
}))

const ComboBuilder = () => {
  usePrivateGuard()

  const classes = useStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const [selectedTraderIds, setSelectedTraderIds] = vendorTool.react.useState<number[]>([])
  const [envName, setEnvName] = vendorTool.react.useState('')

  const { getTraderProfile, createTraderCombo } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()
  const profiles = user.userTraderIds?.map((traderId) => getTraderProfile(traderId)) || []

  const parsedName = envName.trim().toLowerCase()
  const hasValidName = !!parsedName.trim()
  const hasValidTraders = selectedTraderIds.length >= 2

  const hasDuplicatedName = user.comboProfiles.some((combo) => combo.identity.name.toLowerCase() === parsedName)
  const hasDuplicatedCombo = user.comboProfiles.some((combo) => {
    const currentIds = combo.identity.traderIds.join(',')
    const buildIds = selectedTraderIds.join(',')
    return currentIds === buildIds
  })

  // ------------------------------------------------------------ Handler --

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const isSelected = selectedTraderIds.includes(trader.id)
    setSelectedTraderIds((ids) => {
      const newIds = isSelected
        ? ids.filter((id) => id !== trader.id)
        : [...ids, trader.id]
      return newIds.sort((prev, curr) => prev < curr ? -1 : 1)
    })
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
    const result = await createTraderCombo(envName, selectedTraderIds)
    if (result) {
      const link = routerTool.dashboardRoute()
      navigate(link)
    }
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='column-center'>
      <header className={vendorTool.classNames('row-around', classes.row)}>
        <h2>{localeTool.t('comboBuilder.title')}</h2>
      </header>
      <section className={vendorTool.classNames('row-between', classes.row)}>
        <RequiredLabel title={localeTool.t('comboBuilder.name')} />
        <vendorTool.ui.Input
          value={envName}
          onChange={handleChangeName}
        />
      </section>
      <section className={vendorTool.classNames('column-center', classes.profileTitle)}>
        <h4>
          {localeTool.t('comboBuilder.selectProfiles')}:&nbsp;
          ({selectedTraderIds.length} / {profiles.length})
        </h4>
        <RequiredLabel title={localeTool.t('comboBuilder.minTraderRequired')} />
      </section>
      {profiles.length < 2 && (
        <vendorTool.ui.Message error className={classes.warningMsg}>
          {localeTool.t('comboBuilder.noEnoughProfiles')}
        </vendorTool.ui.Message>
      )}
      <section className='row-around'>
        {profiles.map((profile, index) => (
          <TraderProfileCard
            key={profile?.trader.id || `index-${index}`}
            profile={profile}
            isActive={selectedTraderIds.some((id) => id === profile?.trader.id)}
            onClick={handleClickProfile}
            simple
          />
        ))}
      </section>
      {hasDuplicatedName && (
        <vendorTool.ui.Message negative>
          {localeTool.t('comboBuilder.duplicatedName')}
        </vendorTool.ui.Message>
      )}
      {hasDuplicatedCombo && (
        <vendorTool.ui.Message negative>
          {localeTool.t('comboBuilder.duplicatedCombo')}
        </vendorTool.ui.Message>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row-around'>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={!hasValidName || !hasValidTraders || hasDuplicatedName}
          >
            {localeTool.t('common.confirmAndWatch')}
          </vendorTool.ui.Button>
        </div>
      </form>
    </section>
  )
}

export default ComboBuilder
