const express = require('express');
const helmet = require('helmet');

const Users = require('./data/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('this thing is alive');
});

server.get('/api/users', (req, res) => {
    Users.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = server;