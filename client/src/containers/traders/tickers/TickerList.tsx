import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import useTickerState from '../../../states/useTickerState'
import TickerLabel from '../elements/TickerLabel'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((theme: themeEnum.Theme) => ({
  section: {
    marginBottom: '1rem',
  },
  isActive: {
    border: `3px solid ${theme.PRIMARY_COLOR} !important`,
  },
}))

const isSearchedTicker = (
  ticker: interfaces.tickerModel.Identity,
  searchText: string,
): boolean => {
  const search = searchText.trim().toLowerCase()
  if (!search) return true
  if (ticker.symbol.toLowerCase().includes(search)) return true
  if (ticker.name.toLowerCase().includes(search)) return true
  return false
}

const TickerList = () => {
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const [selectedCategory, setSelectedCategory] = vendorTool.react.useState(1)
  const [searchText, setSearchText] = vendorTool.react.useState('')

  const { getTickerIdentities, getTickerCategories } = useTickerState()

  const tickers = getTickerIdentities()
  const availableTickers = tickers.filter((ticker) => {
    const matchCategory = ticker.tickerCategoryId === selectedCategory
    const matchSearch = isSearchedTicker(ticker, searchText)
    return matchCategory && matchSearch
  })

  const categories = getTickerCategories()

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    const url = routerTool.tickerDetailRoute(1, tickerId)
    navigate(url)
  }

  const handleChangeSearchText = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  const handleClickCategory = (id: number) => {
    setSelectedCategory(id)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <header className={classes.section}>
          <vendorTool.ui.Input
            icon='search'
            placeholder={localeTool.t('common.search')}
            value={searchText}
            onChange={handleChangeSearchText}
          />
        </header>
        <section className='row-start'>
          {availableTickers.map((ticker) => (
            <TickerLabel
              color='grey'
              key={ticker.id}
              ticker={ticker}
              onClick={handleClickTicker}
            />
          ))}
        </section>
      </section>
      <aside className={pageClasses.aside}>
        <h3>{localeTool.t('tickerList.categories')}:</h3>
        {categories.map((category) => (
          <vendorTool.ui.Card
            key={category.id}
            className={vendorTool.classNames({
              [classes.isActive]: category.id === selectedCategory,
            })}
            onClick={() => handleClickCategory(category.id)}
            header={category.name}
          />
        ))}
      </aside>
    </section>
  )
}

export default TickerList
