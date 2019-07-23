exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, username: 'Ropeks', password: '12345' },
        { id: 2, username: 'Alex', password: '12345' },
        { id: 3, username: 'Matt', password: '12345' }
      ]);
    });
};