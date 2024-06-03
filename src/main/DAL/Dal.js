const { dbConfig, presentationDbConfig} = require("./Configurations");
const initSequelize = require("./Sequelize");
const UserRepository = require("./User/UserRepository");

const sequelize = initSequelize(presentationDbConfig);

const userRepo = new UserRepository(sequelize);

module.exports = {userRepo}