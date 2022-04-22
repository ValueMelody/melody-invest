import TrendChart from '../elements/TrendChart'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as vendorTool from '../../../tools/vendor'
import * as context from '../../../states/context'

const useStyles = vendorTool.jss.createUseStyles(({
  root: {
    margin: '1rem 0',
  },
}))

const ComboStats = ({
  combo,
}: {
  combo: context.ComboProfile,
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const oneDecadeTrends = combo?.detail?.oneDecadeTrends && combo?.detail?.totalValue
    ? parseTool.chartTrends(combo.detail.oneDecadeTrends, combo.detail.totalValue)
    : []

  const oneYearTrends = combo?.detail?.oneYearTrends && combo?.detail?.totalValue
    ? parseTool.chartTrends(combo.detail.oneYearTrends, combo.detail.totalValue)
    : []

  // ------------------------------------------------------------ UI --

  return (
    <section className={vendorTool.classNames('row-around', classes.root)}>
      <TrendChart
        data={oneDecadeTrends}
        title={`${localeTool.t('common.yearsTrends', { num: oneDecadeTrends.length - 1 })}`}
      />
      <TrendChart
        data={oneYearTrends}
        title={`${localeTool.t('common.daysTrends', { num: 30 * (oneYearTrends.length - 1) })}`}
      />
    </section>
  )
}

export default ComboStats
