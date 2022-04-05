import { useState, ChangeEvent } from 'react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import { Input } from 'semantic-ui-react'
import * as localeTool from '../../../tools/locale'
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

  // ------------------------------------------------------------ State --
  const [searchText, setSearchText] = useState('')

  const { getTickerIdentities } = useTickerState()
  const tickers = getTickerIdentities()
  const availableTickers = tickers.filter((ticker) => isSearchedTicker(ticker, searchText))

  // ------------------------------------------------------------ Handler --

  const handleClickLabel = (tickerId: number) => {
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
        {availableTickers.map((ticker) => (
          <TickerLabel
            key={ticker.id}
            ticker={ticker}
            onClick={handleClickLabel}
          />
        ))}
      </section>
    </>
  )
}

export default TickerList
