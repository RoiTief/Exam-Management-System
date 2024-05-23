const defineUserModel = require('./User')
const { USERNAME_EXISTS, USERNAME_NOT_EXISTS, EMAIL_IN_USE } = require('../ErrorMsgs')
const { EMSError, PK_NOT_EXISTS, PK_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } = require('../../EMSError')
const util = require('util')

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
            return await this.#User.create(userData);
        } catch (err) {
            // Check if the error is a SequelizeUniqueConstraintError
            if (err.name === 'SequelizeUniqueConstraintError') {
                // Check if the error is related to username or email uniqueness
                err.errors.forEach(err => {
                    if (err.path === 'username') {
                        throw new EMSError(util.format(USERNAME_EXISTS, userData.username), PK_ALREADY_EXISTS);
                    } else if (err.path === 'email') {
                        throw new EMSError(util.format(EMAIL_IN_USE, userData.email), EMAIL_ALREADY_EXISTS);
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
            throw new EMSError(util.format(USERNAME_NOT_EXISTS, username), PK_NOT_EXISTS);
        }
        return foundUser;
    }
}

module.exports = UserRepository;