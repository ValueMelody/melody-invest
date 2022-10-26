import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Input, Message, Button } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import useUserState from 'states/useUserState'
import useTraderState from 'states/useTraderState'
import useTraderRequest from 'requests/useTraderRequest'
import usePrivateGuard from 'handlers/usePrivateGuard'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'

const useStyles = createUseStyles(({
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

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const [selectedTraderIds, setSelectedTraderIds] = useState<number[]>([])
  const [envName, setEnvName] = useState('')

  const { createTraderCombo } = useTraderRequest()
  const { getTraderProfile, getTraderCombos } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()
  const profiles = user.userTraderIds.map((traderId) => getTraderProfile(traderId)) || []

  const parsedName = envName.trim().toLowerCase()
  const hasValidName = !!parsedName.trim()
  const hasValidTraders = selectedTraderIds.length >= 2

  const traderCombos = getTraderCombos()

  const hasDuplicatedName = traderCombos.some((combo) => combo.identity.name.toLowerCase() === parsedName)
  const hasDuplicatedCombo = traderCombos.some((combo) => {
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
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEnvName(e.target.value)
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    await createTraderCombo(envName, selectedTraderIds)
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className={commonClasses.columnCenter}>
      <header className={classNames(
        commonClasses.rowAround,
        classes.row,
      )}>
        <h2>{localeTool.t('comboBuilder.title')}</h2>
      </header>
      <section className={classNames(
        commonClasses.rowBetween,
        classes.row,
      )}>
        <RequiredLabel title={localeTool.t('comboBuilder.name')} />
        <Input
          value={envName}
          onChange={handleChangeName}
        />
      </section>
      <section className={classNames(
        commonClasses.columnCenter,
        classes.profileTitle,
      )}>
        <h4>
          {localeTool.t('comboBuilder.selectProfiles')}:&nbsp;
          ({selectedTraderIds.length} / {profiles.length})
        </h4>
        <RequiredLabel title={localeTool.t('comboBuilder.minTraderRequired')} />
      </section>
      {profiles.length < 2 && (
        <Message error className={classes.warningMsg}>
          {localeTool.t('comboBuilder.noEnoughProfiles')}
        </Message>
      )}
      <section className={commonClasses.rowAround}>
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
        <Message negative>
          {localeTool.t('comboBuilder.duplicatedName')}
        </Message>
      )}
      {hasDuplicatedCombo && (
        <Message negative>
          {localeTool.t('comboBuilder.duplicatedCombo')}
        </Message>
      )}
      <form onSubmit={handleSubmit}>
        <div className={commonClasses.rowAround}>
          <Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={!hasValidName || !hasValidTraders || hasDuplicatedName}
          >
            {localeTool.t('common.confirmAndWatch')}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ComboBuilder
