
const dbConfig = {
    database: 'db_t',
    username: 'user_t',
    password: '123',
    host: '164.90.223.94', 
    port: '5432',
    dialect: 'postgres',
    logging: false
}

const presentationDbConfig = {
    database: 'presentation',
    username: 'user_t',
    password: '123',
    host: '164.90.223.94',
    port: '5432',
    dialect: 'postgres',
    logging: false
}

module.exports = { dbConfig, presentationDbConfig } ;