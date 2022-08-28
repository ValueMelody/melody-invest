exports.seed = (knex) => {
  return knex('trader_holding').insert([
    {
      date: '2021-12-31',
      traderId: 1,
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a1',
      totalValue: '113200',
      totalCash: '10000',
      items: JSON.stringify([
        {
          value: 100000,
          shares: 1000,
          splitMultiplier: 1,
          tickerId: 1,
        },
        {
          value: 3200,
          shares: 100,
          splitMultiplier: 1,
          tickerId: 2,
        },
      ]),
    },
    {
      date: '2022-01-01',
      traderId: 1,
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a2',
      totalValue: '118200',
      totalCash: '10000',
      items: JSON.stringify([
        {
          value: 99540,
          shares: 948,
          splitMultiplier: 1,
          tickerId: 1,
        },
        {
          value: 3200,
          shares: 100,
          splitMultiplier: 1,
          tickerId: 2,
        },
        {
          value: 1111,
          shares: 5,
          splitMultiplier: 2,
          tickerId: 3,
        },
      ]),
    },
    {
      date: '2021-12-31',
      traderId: 2,
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a3',
      totalValue: '105000',
      totalCash: '100000',
      items: JSON.stringify([
        {
          value: 5000,
          shares: 50,
          splitMultiplier: 1,
          tickerId: 1,
        },
      ]),
    },
    {
      date: '2021-01-02',
      traderId: 3,
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a4',
      totalValue: '105000',
      totalCash: '100000',
      items: JSON.stringify([
        {
          value: 4500,
          shares: 10,
          splitMultiplier: 1,
          tickerId: 3,
        },
      ]),
    },
  ])
}
