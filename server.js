const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

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

server.post('/api/register', (req, res) => {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);

    Users.addUser(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    
    Users.getUserBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Hello ${username}!` });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = server;