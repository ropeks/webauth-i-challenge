const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const Users = require('./data/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(session({
    name: 'sessionId',
    secret: 'gfhghhjvcfxxgfcghvjjbjn',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: require('./data/dbConfig.js'), // configured instance of knex
        tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
        sidfieldname: 'sid', // column that will hold the session id, name it anything you want
        createtable: true, // if the table does not exist, it will create it automatically
        clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
    })
}));

server.get('/', (req, res) => {
    res.send('Welcome!');
});

server.get('/api/users', restricted, (req, res) => {
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
                req.session.user = user;
                res.status(200).json({ message: `Hello ${username}!` });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send(err.message);
            } else {
                res.send('sorry to see you go :(');
            }
        });
    } else {
        res.end();
    }
});

function restricted(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(400).json({ message: 'You are not logged in.' });
    }
}

module.exports = server;