
const knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const database = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
          }
    },
    pool: { min: 1, max: 12 }
});

const pgStore = new KnexSessionStore({
    knex: database,
    tablename: 'sessions',
});

module.exports = { database,  pgStore,};