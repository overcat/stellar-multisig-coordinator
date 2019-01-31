const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'db');
// Update with your config settings.

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            port: '5432',
            database: 'coordinator',
            user: 'postgres',
            password: 'password'
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
    },
    production: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            port: '5432',
            database: 'coordinator',
            user: 'postgres',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
    }
};
