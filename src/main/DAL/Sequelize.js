
const { Sequelize } = require('sequelize');

function initSequelize(config) {
    return new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: config.logging
    });
}

module.exports = initSequelize;