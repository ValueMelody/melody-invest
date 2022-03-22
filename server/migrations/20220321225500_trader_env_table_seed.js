exports.up = (knex) => {
  return knex('trader_env').insert([
    { activeTotal: 10000, name: 'default' },
  ])
}

exports.down = () => {}
