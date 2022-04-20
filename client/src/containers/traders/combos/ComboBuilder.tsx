import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import * as commonEnum from '../../../enums/common'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import TraderEnvCard from '../elements/TraderEnvCard'
import RequiredLabel from '../../elements/RequiredLabel'
import ProfileCard from '../blocks/ProfileCard'
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

  const [envId, setEnvId] = vendorTool.react.useState(commonEnum.DEFAULT_ENV_ID)
  const [selectedTraderIds, setSelectedTraderIds] = vendorTool.react.useState<number[]>([])
  const [envName, setEnvName] = vendorTool.react.useState('')

  const { getProfileDetail, createTraderCombo } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()
  const profiles = user.userTraderIds?.map((traderId) => getProfileDetail(traderId)) || []
  const filteredProfiles = profiles.filter((profile) => profile?.trader.traderEnvId === envId)

  const hasValidName = !!envName.trim()
  const hasValidTraders = selectedTraderIds.length >= 2

  // ------------------------------------------------------------ Handler --

  const handleSelectEnv = (id: number) => {
    setEnvId(id)
  }

  const handleClickProfile = (trader: interfaces.traderModel.Record) => {
    const isSelected = selectedTraderIds.includes(trader.id)
    setSelectedTraderIds((ids) => {
      const newIds = isSelected
        ? ids.filter((id) => id !== trader.id)
        : [...ids, trader.id]
      return newIds
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
    const result = await createTraderCombo(envName, envId, selectedTraderIds)
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
      <h4>{localeTool.t('common.selectEnvironment')}:</h4>
      <section className='row-start'>
        {user.userTraderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
            traderEnv={traderEnv}
            isActive={traderEnv.id === envId}
            onClick={handleSelectEnv}
          />
        ))}
      </section>
      <section className={vendorTool.classNames('column-center', classes.profileTitle)}>
        <h4>
          {localeTool.t('comboBuilder.selectProfiles')}:&nbsp;
          ({selectedTraderIds.length} / {filteredProfiles.length})
        </h4>
        <RequiredLabel title={localeTool.t('comboBuilder.minTraderRequired')} />
      </section>
      {filteredProfiles.length < 2 && (
        <vendorTool.ui.Message error className={classes.warningMsg}>
          {localeTool.t('comboBuilder.noEnoughProfiles')}
        </vendorTool.ui.Message>
      )}
      <section className='row-around'>
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile?.trader.id}
            profile={profile}
            isActive={selectedTraderIds.some((id) => id === profile?.trader.id)}
            onClick={handleClickProfile}
            simple
          />
        ))}
      </section>
      <section className={vendorTool.classNames('row-between', classes.row)}>
        <RequiredLabel title={localeTool.t('comboBuilder.name')} />
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
            disabled={!hasValidName || !hasValidTraders}
          >
            {localeTool.t('common.confirmAndWatch')}
          </vendorTool.ui.Button>
        </div>
      </form>
    </section>
  )
}

export default ComboBuilder
