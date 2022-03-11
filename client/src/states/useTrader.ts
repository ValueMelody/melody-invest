import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { store, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useTrader = () => {
  const context: Context = useContext(store)

  const getTrader = (id: number | null) => {
    if (!id) return null
    return context.traders[id] || null
  }

  const storeTrader = (summary: interfaces.tradersResponse.TraderSummary) => {
    context.setTraders((traders) => ({ ...traders, [summary.trader.id]: summary }))
  }

  const storeTopTraders = (topTraders: interfaces.tradersResponse.Top) => {
    context.setResources((resources) => ({ ...resources, topTraders }))
    const traders = [
      ...topTraders.yearly,
      ...topTraders.pastYear, ...topTraders.pastQuarter,
      ...topTraders.pastMonth, ...topTraders.pastWeek,
    ]
    const traderSummaries = traders.reduce((summaries, summary) => {
      return { ...summaries, [summary.trader.id]: summary }
    }, {})
    context.setTraders((traders) => ({ ...traders, ...traderSummaries }))
  }

  const fetchTrader = async (id: number, accessCode: string) => {
    const endpoint = `${routerConstant.API.TRADERS}/${id}/${accessCode}`
    context.startLoading()
    const trader = await requestAdpater.sendGetRequest(endpoint)
    storeTrader(trader)
    context.stopLoading()
  }

  const fetchTopTraders = async () => {
    const endpoint = `${routerConstant.API.TRADERS}/top`
    context.startLoading()
    const traders = await requestAdpater.sendGetRequest(endpoint)
    context.stopLoading()
    storeTopTraders(traders)
  }

  return {
    getTrader,
    fetchTrader,
    topTraders: context.resources.topTraders,
    fetchTopTraders,
  }
}

export default useTrader
