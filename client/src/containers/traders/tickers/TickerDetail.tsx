import { useParams } from 'react-router-dom'
import useTickerState from '../../../states/useTickerState'

const TickerDetail = () => {
  const params = useParams()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : null
  const envId = params.envId ? parseInt(params.envId) : 1
  console.log(envId)

  const tickerIdentities = getTickerIdentities()
  const tickerIdentity = tickerIdentities.find((identity) => identity.id === tickerId) || null
  console.log(tickerIdentity)

  return (
    <div>123</div>
  )
}

export default TickerDetail
