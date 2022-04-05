import { useState, ChangeEvent } from 'react'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import { useNavigate } from 'react-router-dom'
import { Input } from 'semantic-ui-react'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as routerTool from '../../../tools/router'
import BehaviorLabel from '../elements/BehaviorLabel'

const useStyles = createUseStyles(({
  section: {
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
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --
  const [searchText, setSearchText] = useState('')

  const buyBehaviors = constants.behavior.buyBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const sellBehaviors = constants.behavior.sellBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const otherBehaviors = [
    ...constants.behavior.preferenceBehaviors,
    ...constants.behavior.allocateBehaviors,
    ...constants.behavior.frequencyBehaviors,
  ].filter((behavior) => isSearchedBehavior(behavior, searchText))

  // ------------------------------------------------------------ Handler --

  const handleClickLabel = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = routerTool.behaviorDetailRoute(1, behavior)
    navigate(url)
  }

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <>
      <header className={classes.section}>
        <Input
          icon='search'
          placeholder={localeTool.t('common.search')}
          value={searchText}
          onChange={handleChangeSearchText}
        />
      </header>
      <section className={classes.section}>
        <h2>{localeTool.t('tradeBehaviors.buyBehaviors')}</h2>
        {buyBehaviors.map((behavior) => (
          <BehaviorLabel
            key={behavior}
            behavior={behavior}
            color='grey'
            onClick={handleClickLabel}
          />
        ))}
      </section>
      <section className={classes.section}>
        <h2>{localeTool.t('tradeBehaviors.sellBehaviors')}</h2>
        {sellBehaviors.map((behavior) => (
          <BehaviorLabel
            key={behavior}
            behavior={behavior}
            color='grey'
            onClick={handleClickLabel}
          />
        ))}
      </section>
      <section className={classes.section}>
        <h2>{localeTool.t('tradeBehaviors.otherBehaviors')}</h2>
        {otherBehaviors.map((behavior) => (
          <BehaviorLabel
            key={behavior}
            behavior={behavior}
            color='grey'
            onClick={handleClickLabel}
          />
        ))}
      </section>
    </>
  )
}

export default BehaviorList
