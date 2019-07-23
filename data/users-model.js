const knex = require('knex');
const db = knex(require('../knexfile').development);

function getUsers() {
    return db('users');
}

function addUser(user) {

}

module.exports = {
    getUsers,
    addUser
};