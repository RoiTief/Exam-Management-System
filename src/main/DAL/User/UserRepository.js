const defineUserModel = require('./User')
const { EMSError, ERROR_CODES } = require('../../EMSError')
const util = require('util')
const {USER_PROCESS_ERROR_MSGS: ERROR_MSGS} = require("../../ErrorMessages");

class UserRepository {
    #User

    constructor(sequelize) {
        this.#User = defineUserModel(sequelize);
        this.#User.sync({alter: true});
    }

    /**
     * Adds a new user to the database.
     * @param {*} userData dictionary of user's data, should have keys
     * 'username', 'firstName', 'lastName', 'email', 'password', 'userType'
     * @returns The added user.
     */
    async addUser(userData) {
        try {
            return (await this.#User.create(userData));
        } catch (err) {
            // Check if the error is a SequelizeUniqueConstraintError
            if (err.name === 'SequelizeUniqueConstraintError') {
                // Check if the error is related to username or email uniqueness
                err.errors.forEach(err => {
                    if (err.path === 'username') {
                        throw new EMSError(ERROR_MSGS.USERNAME_ALREADY_EXIST(userData.username), ERROR_CODES.USERNAME_ALREADY_EXIST);
                    } else if (err.path === 'email') {
                        throw new EMSError(ERROR_MSGS.EMAIL_ALREADY_EXIST(userData.email), ERROR_CODES.EMAIL_ALREADY_EXIST);
                    }
                });
            } else {
                // Handle other errors
                console.error('Error adding user:', err);
            }
        }
    }

    async getUser(username) {
        const foundUser = await this.#User.findByPk(username);
        if (foundUser === null) {
            throw new EMSError(ERROR_MSGS.USERNAME_DOESNT_EXIST(username), ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
        return foundUser;
    }

    async getAllUsers() {
        return (await this.#User.findAll());
    }

    async deleteUser(username) {
        await this.#User.destroy({
            where: {
                username: username,
            }
        })
    }
}

module.exports = UserRepository;