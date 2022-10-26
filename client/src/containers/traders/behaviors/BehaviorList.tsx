import { useState, ChangeEvent } from 'react'
import { Input } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import useTraderStyle from 'styles/useTraderStyle'
import BehaviorLabel from 'containers/traders/elements/BehaviorLabel'
import VariationList from 'containers/traders/elements/VariationList'

const useStyles = createUseStyles(({
  header: {
    marginBottom: '1rem',
  },
}))

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

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { traderClasses } = useTraderStyle()

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

  const focusedOption = focusOptions.find((option) => option.value === focusedType)

  // ------------------------------------------------------------ Handler --

  const handleClickLabel = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = routerTool.behaviorDetailRoute(1, behavior)
    navigate(url)
  }

  const handleChangeSearchText = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  // ------------------------------------------------------------ UI --

  if (!focusedOption) return null

  return (
    <section className={traderClasses.root}>
      <section className={traderClasses.main}>
        <header className={classes.header}>
          <Input
            icon='search'
            placeholder={localeTool.t('common.search')}
            value={searchText}
            onChange={handleChangeSearchText}
          />
        </header>
        <section>
          {focusedOption.behaviors.map((behavior) => (
            <BehaviorLabel
              key={behavior}
              behavior={behavior}
              color='grey'
              onClick={handleClickLabel}
            />
          ))}
        </section>
      </section>
      <aside className={traderClasses.aside}>
        <h2>{localeTool.t('tradeBehaviors.type')}:</h2>
        <VariationList
          options={focusOptions}
          activeValue={focusedType}
        />
      </aside>
    </section>
  )
}

export default BehaviorList
