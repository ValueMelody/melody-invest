exports.up = (knex) => {
  return knex.schema
    .createTable('trader', (table) => {
      table.increments('id')
      table.specificType('accessCode', 'CHAR(16)').notNullable()
      table.integer('traderEnvId').notNullable()
      table.integer('traderPatternId').notNullable()
      table.boolean('isActive').notNullable()
      table.string('totalValue', 15)
      table.smallint('totalDays')
      table.specificType('startedAt', 'CHAR(10)')
      table.specificType('rebalancedAt', 'CHAR(10)')
      table.specificType('estimatedAt', 'CHAR(10)')
      table.integer('grossPercentNumber')
      table.integer('yearlyPercentNumber')
      table.integer('pastYearPercentNumber')
      table.integer('pastQuarterPercentNumber')
      table.integer('pastMonthPercentNumber')
      table.integer('pastWeekPercentNumber')
      table.unique(['traderEnvId', 'traderPatternId'], 'trader_ukey')
      table.foreign('traderEnvId').references('id').inTable('trader_env')
      table.foreign('traderPatternId').references('id').inTable('trader_pattern')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader')
}
