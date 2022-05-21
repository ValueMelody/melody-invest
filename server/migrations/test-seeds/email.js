exports.seed = (knex) => {
  return knex('email').insert([
    {
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a1',
      sendTo: 'a@company.com',
      sendBy: 'test@email.com',
      title: 'activation email',
      content: 'This is an activation email',
      status: 2,
      response: { completed: true },
      createdAt: '2019-01-01',
      sentAt: '2019-01-02',
    },
    {
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a2',
      sendTo: 'b@company.com',
      sendBy: 'test@email.com',
      title: 'activation email',
      content: 'This is an activation email',
      status: 0,
      response: null,
      createdAt: '2019-01-01',
      sentAt: null,
    },
    {
      id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a3',
      sendTo: 'c@company.com',
      sendBy: 'test@email.com',
      title: 'set password email',
      content: 'This is reset password email',
      status: 0,
      response: null,
      createdAt: '2019-01-02',
      sentAt: null,
    },
  ])
}

exports.down = () => {}
