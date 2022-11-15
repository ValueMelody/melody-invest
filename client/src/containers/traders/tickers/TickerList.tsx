import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { ChangeEvent, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TextInput } from 'flowbite-react'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import VariationList from 'containers/traders/elements/VariationList'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

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
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const [selectedCategory, setSelectedCategory] = useState(1)
  const [searchText, setSearchText] = useState('')

  const tickers = useSelector(selectors.selectTickerIdentityBases())
  const categories = useSelector(selectors.selectTickerCategoryBases())

  const availableTickers = tickers.filter((ticker) => {
    const matchCategory = ticker.tickerCategoryId === selectedCategory
    const matchSearch = isSearchedTicker(ticker, searchText)
    return matchCategory && matchSearch
  })

  const categoryOptions = categories.map((category) => ({
    label: localeTool.t(category.name),
    value: category.id,
    onClick: () => setSelectedCategory(category.id),
  }))

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    const url = routerTool.tickerDetailRoute(1, tickerId)
    navigate(url)
  }

  const handleChangeSearchText = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='page-root'>
      <section className='page-main'>
        <header className='mb-4'>
          <TextInput
            icon={MagnifyingGlassIcon}
            placeholder={localeTool.t('common.search')}
            value={searchText}
            onChange={handleChangeSearchText}
          />
        </header>
        <section className='flex flex-wrap'>
          {availableTickers.map((ticker) => (
            <TickerLabel
              key={ticker.id}
              className='mx-2 my-1'
              color='gray'
              ticker={ticker}
              onClick={handleClickTicker}
            />
          ))}
        </section>
      </section>
      <aside className='page-aside'>
        <h1 className='mb-4 font-bold'>
          {localeTool.t('tickerList.categories')}
        </h1>
        <VariationList
          options={categoryOptions}
          activeValue={selectedCategory}
        />
      </aside>
    </section>
  )
}

export default TickerList
