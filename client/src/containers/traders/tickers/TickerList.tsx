import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Badge, Button, Card, TextInput } from 'flowbite-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import RequiredLabel from 'containers/elements/RequiredLabel'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import { useNavigate } from 'react-router-dom'
import usePrivateGuard from 'hooks/usePrivateGuard'
import useShowMore from 'hooks/useShowMore'

const isSearchedTicker = (
  ticker: interfaces.tickerModel.Record,
  searchText: string,
): boolean => {
  const search = searchText.trim().toLowerCase()
  if (!search) return true
  if (ticker.symbol.toLowerCase().includes(search)) return true
  if (localeTool.getTickerName(ticker.symbol).toLowerCase().includes(search)) return true
  return false
}

const noteClass = 'text-sm italic'

const TickerList = () => {
  usePrivateGuard()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { displayedTotal, renderShowMoreButton } = useShowMore({
    default: 100,
    more: 100,
  })

  const [searchText, setSearchText] = useState('')
  const [tickerSymbol, setTickerSymbol] = useState('')

  const tickers = useSelector(selectors.selectTickerIdentityBases())

  const availableTickers = tickers.filter((ticker) => isSearchedTicker(ticker, searchText))
  const displayedTickers = availableTickers.slice(0, displayedTotal)

  const handleClickTicker = (tickerId: number) => {
    const url = routerTool.tickerDetailRoute(1, tickerId)
    navigate(url)
  }

  const handleChangeSearchText = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value)
  }

  const handleChangeTickerSymbol = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setTickerSymbol(e.target.value.toUpperCase())
  }

  const handleConfirmAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(actions.createTicker({
      symbol: tickerSymbol.trim(),
    })).then(() => setTickerSymbol(''))
  }

  return (
    <section className='page-root'>
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
        <section className='flex flex-wrap mb-6'>
          {displayedTickers.map((ticker) => (
            <TickerLabel
              key={ticker.id}
              className='mx-2 my-1'
              color='gray'
              ticker={ticker}
              onClick={handleClickTicker}
            />
          ))}
        </section>
        {displayedTotal < availableTickers.length && renderShowMoreButton()}
      </section>
      <aside className='page-aside'>
        <Card>
          <header className='flex'>
            <Badge>
              {localeTool.t('availableTickers.addTitle')}
            </Badge>
          </header>
          <RequiredLabel
            title={localeTool.t('availableTickers.tickerMarket')}
          />
          <p className={noteClass}>
            * {localeTool.t('availableTickers.tickerMarketNote')}
          </p>
          <RequiredLabel
            title={localeTool.t('availableTickers.tickerSymbol')}
          />
          <TextInput
            placeholder={localeTool.t('availableTickers.tickerSymbol')}
            value={tickerSymbol}
            onChange={handleChangeTickerSymbol}
          />
          <p className={noteClass}>
            * {localeTool.t('availableTickers.tickerSymbolNote', { source: localeTool.t('shared.dataSource') })}
          </p>
          <form onSubmit={handleConfirmAdd}>
            <Button
              type='submit'
              disabled={!tickerSymbol}
            >
              {localeTool.t('availableTickers.confirmAdd')}
            </Button>
          </form>
        </Card>
      </aside>
    </section>
  )
}

export default TickerList
