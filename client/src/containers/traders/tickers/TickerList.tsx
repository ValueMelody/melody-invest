import { useState, ChangeEvent } from 'react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import { Input } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import useTickerState from '../../../states/useTickerState'
import TickerLabel from '../elements/TickerLabel'

const useStyles = createUseStyles(({
  section: {
    marginBottom: '1rem',
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
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --
  const [searchText, setSearchText] = useState('')

  const { getTickerIdentities } = useTickerState()
  const tickers = getTickerIdentities()
  const availableTickers = tickers.filter((ticker) => isSearchedTicker(ticker, searchText))
  const sortedTickers = availableTickers.sort((prev, curr) => curr.symbol > prev.symbol ? -1 : 1)

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    const url = routerTool.tickerDetailRoute(1, tickerId)
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
        {sortedTickers.map((ticker) => (
          <TickerLabel
            color='grey'
            key={ticker.id}
            ticker={ticker}
            onClick={handleClickTicker}
          />
        ))}
      </section>
    </>
  )
}

export default TickerList
