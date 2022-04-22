import TrendChart from '../elements/TrendChart'
import * as parseTool from '../../../tools/parse'
import * as context from '../../../states/context'

const ComboStats = ({
  combo,
}: {
  combo: context.ComboDetail,
}) => {
  const oneYearTrends = combo?.oneYearTrends && combo?.totalValue
    ? parseTool.chartTrends(combo.oneYearTrends, combo.totalValue)
    : []

  return (
    <section>
      <TrendChart data={oneYearTrends} />
    </section>
  )
}

export default ComboStats
