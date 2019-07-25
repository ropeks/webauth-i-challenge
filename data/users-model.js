const knex = require('knex');
const db = knex(require('../knexfile').development);

function getUsers() {
    return db('users');
}

function getUser(id) {
    return db('users')
      .where({ id })
      .first();
}

function getUserBy(filter) {
    return db('users').where(filter);
  }

function addUser(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
            const [id] = ids;
            return getUser(id);
        });
}

module.exports = {
    getUsers,
    getUser,
    getUserBy,
    addUser
};