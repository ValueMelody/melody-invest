import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as routerTool from '../../../tools/router'
import BehaviorLabel from '../elements/BehaviorLabel'
import VariationList from '../elements/VariationList'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles(({
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
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const [searchText, setSearchText] = vendorTool.react.useState('')
  const [focusedType, setFocusedType] = vendorTool.react.useState('buyBehaviors')

  const buyBehaviors = constants.behavior.buyBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const sellBehaviors = constants.behavior.sellBehaviors.filter((behavior) => isSearchedBehavior(behavior, searchText))
  const otherBehaviors = [
    ...constants.behavior.preferenceBehaviors,
    ...constants.behavior.allocateBehaviors,
    ...constants.behavior.frequencyBehaviors,
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
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  // ------------------------------------------------------------ Interface --

  if (!focusedOption) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <header className={classes.header}>
          <vendorTool.ui.Input
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
      <aside className={pageClasses.aside}>
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
