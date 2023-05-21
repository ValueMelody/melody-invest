exports.up = (knex) => {
  return knex.schema
    .table('trader_pattern', (table) => {
      table.dropColumn('durableGoodsMonthlyIncreaseBuy')
      table.dropColumn('durableGoodsMonthlyDecreaseBuy')
      table.dropColumn('durableGoodsMonthlyIncreaseSell')
      table.dropColumn('durableGoodsMonthlyDecreaseSell')
      table.dropColumn('retailSalesMonthlyIncreaseBuy')
      table.dropColumn('retailSalesMonthlyDecreaseBuy')
      table.dropColumn('retailSalesMonthlyIncreaseSell')
      table.dropColumn('retailSalesMonthlyDecreaseSell')
    })
}

exports.down = () => {
}
