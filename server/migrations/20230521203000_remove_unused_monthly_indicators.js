exports.up = (knex) => {
  return knex.schema
    .table('indicator_monthly', (table) => {
      table.dropColumn('durableGoodsMonthlyIncrease')
      table.dropColumn('durableGoodsMonthlyDecrease')
      table.dropColumn('retailSalesMonthlyIncrease')
      table.dropColumn('retailSalesMonthlyDecrease')
    })
}

exports.down = () => {
}
