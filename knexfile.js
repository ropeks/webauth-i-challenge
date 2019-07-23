module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/userbase.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    }
  }
};