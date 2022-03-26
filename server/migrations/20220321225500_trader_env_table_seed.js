exports.up = (knex) => {
  return knex('trader_env').insert([
    { activeTotal: 10000, name: 'default', startDate: '2001-01-01' },
  ])
}

exports.down = () => {}
