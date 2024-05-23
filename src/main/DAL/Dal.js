import dbConfig from "./Configurations";
import initSequelize from "./Sequelize";
import UserRepository from "./User/UserRepository";

const sequelize = initSequelize(dbConfig);

const userRepo = new UserRepository(sequelize);

module.exports = {userRepo}