import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput, Alert } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import usePrivateGuard from 'handlers/usePrivateGuard'
import RequiredLabel from 'containers/elements/RequiredLabel'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'selectors'
import * as actions from 'actions'

const ComboBuilder = () => {
  usePrivateGuard()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const [selectedTraderIds, setSelectedTraderIds] = useState<number[]>([])
  const [comboName, setComboName] = useState('')

  const user = useSelector(selectors.selectUser())
  const profileDict = useSelector(selectors.selectTraderProfileBaseDict())
  const profiles = user.userTraderIds.map((traderId) => profileDict[traderId]) || []

  const parsedName = comboName.trim().toLowerCase()
  const hasValidName = !!parsedName.trim()
  const hasValidTraders = selectedTraderIds.length >= 2

  const traderCombos = useSelector(selectors.selectTraderComboBases())

  const hasDuplicatedName = traderCombos.some((combo) => {
    const name = parseTool.traderComboName(combo)
    return name.toLowerCase() === parsedName
  })
  const hasDuplicatedCombo = traderCombos.some((combo) => {
    const currentIds = combo.traderIds.join(',')
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
    setComboName(e.target.value)
  }

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    dispatch(actions.createTraderCombo({
      name: comboName,
      traderIds: selectedTraderIds,
    })).then((res: any) => {
      if (res?.payload?.id) navigate(routerTool.comboDetailRoute(res.payload.id))
    })
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='flex flex-col items-center'>
      <h1 className='builder-title'>
        {localeTool.t('comboBuilder.title')}
      </h1>
      <section className='flex items-center'>
        <RequiredLabel
          className='w-60'
          title={localeTool.t('comboBuilder.name')}
        />
        <TextInput
          className='w-96'
          value={comboName}
          onChange={handleChangeName}
        />
      </section>
      <h2 className='font-bold mt-4 mb-2'>
        {localeTool.t('comboBuilder.selectProfiles')}:&nbsp;
        ({selectedTraderIds.length} / {profiles.length})
      </h2>
      <RequiredLabel
        className='mb-6'
        title={localeTool.t('comboBuilder.minTraderRequired')}
      />
      {profiles.length < 2 && (
        <Alert
          color='failure'
          className='mb-4'
        >
          {localeTool.t('comboBuilder.noEnoughProfiles')}
        </Alert>
      )}
      <section className='flex items-center justify-around flex-wrap mb-8'>
        {profiles.map((profile, index) => (
          <div
            className='w-1/2 px-8 py-4'
            key={profile?.trader.id || `index-${index}`}
          >
            <TraderProfileCard
              profile={profile}
              isActive={selectedTraderIds.some((id) => id === profile?.trader.id)}
              onClick={handleClickProfile}
              simple
            />
          </div>
        ))}
      </section>
      {hasDuplicatedName && (
        <Alert
          color='failure'
          className='mb-4'
        >
          {localeTool.t('comboBuilder.duplicatedName')}
        </Alert>
      )}
      {hasDuplicatedCombo && (
        <Alert
          color='failure'
          className='mb-4'
        >
          {localeTool.t('comboBuilder.duplicatedCombo')}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <footer className='flex justify-center'>
          <Button
            type='submit'
            disabled={!hasValidName || !hasValidTraders || hasDuplicatedName}
          >
            {localeTool.t('common.confirmAndWatch')}
          </Button>
        </footer>
      </form>
    </section>
  )
}

export default ComboBuilder
