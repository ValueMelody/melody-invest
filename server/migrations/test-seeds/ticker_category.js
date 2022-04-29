exports.up = (knex) => {
  return knex('ticker_category').insert([
    { name: 'Tec', desc: 'Tech' },
    { name: 'Hardware', desc: 'haredware' },
  ])
}

exports.down = () => {}
