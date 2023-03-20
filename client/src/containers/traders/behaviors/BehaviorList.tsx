import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import { ChangeEvent, useState } from 'react'
import BehaviorLabel from 'containers/traders/elements/BehaviorLabel'
import DisclaimerModal from 'containers/traders/elements/DisclaimerModal'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TextInput } from 'flowbite-react'
import VariationList from 'containers/traders/elements/VariationList'
import { useNavigate } from 'react-router-dom'

const isSearchedBehavior = (
  behavior: interfaces.traderPatternModel.Behavior,
  searchText: string,
): boolean => {
  const search = searchText.trim().toLowerCase()
  if (!search) return true
  if (behavior.toLowerCase().includes(search)) return true
  if (parseTool.behaviorTitle(behavior).toLowerCase().includes(search)) return true
  if (parseTool.behaviorDesc(behavior).toLowerCase().includes(search)) return true
  return false
}

const BehaviorList = () => {
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [focusedType, setFocusedType] = useState('buyBehaviors')

  const buyBehaviors = constants.Behavior.BuyBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const sellBehaviors = constants.Behavior.SellBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const otherBehaviors = [
    ...constants.Behavior.PreferenceBehaviors,
    ...constants.Behavior.AllocateBehaviors,
    ...constants.Behavior.FrequencyBehaviors,
  ].filter((behavior) => isSearchedBehavior(behavior, searchText))

  const focusOptions = [
    {
      value: 'buyBehaviors',
      label: localeTool.t('tradeBehaviors.buyBehaviors'),
      behaviors: buyBehaviors,
      onClick: () => setFocusedType('buyBehaviors'),
    },
    {
      value: 'sellBehaviors',
      label: localeTool.t('tradeBehaviors.sellBehaviors'),
      behaviors: sellBehaviors,
      onClick: () => setFocusedType('sellBehaviors'),
    },
    {
      value: 'otherBehaviors',
      label: localeTool.t('tradeBehaviors.otherBehaviors'),
      behaviors: otherBehaviors,
      onClick: () => setFocusedType('otherBehaviors'),
    },
  ]

  const focusedOption = focusOptions.find((option) => option.value === focusedType)!

  const handleClickLabel = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = routerTool.behaviorDetailRoute(1, behavior)
    navigate(url)
  }

  const handleChangeSearchText = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  return (
    <section className='page-root'>
      <DisclaimerModal />
      <section className='page-main'>
        <header className='mb-4'>
          <TextInput
            data-testid='search'
            icon={MagnifyingGlassIcon}
            placeholder={localeTool.t('resource.search')}
            value={searchText}
            onChange={handleChangeSearchText}
          />
        </header>
        <section className='flex flex-wrap'>
          {focusedOption.behaviors.map((behavior) => (
            <BehaviorLabel
              key={behavior}
              className='mx-2 my-1'
              behavior={behavior}
              color='gray'
              onClick={handleClickLabel}
            />
          ))}
        </section>
      </section>
      <aside className='page-aside'>
        <h1 className='mb-4 font-bold'>
          {localeTool.t('tradeBehaviors.type')}
        </h1>
        <VariationList
          options={focusOptions}
          activeValue={focusedType}
        />
      </aside>
    </section>
  )
}

export default BehaviorList
