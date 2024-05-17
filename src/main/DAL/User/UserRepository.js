const defineUserModel = require('./User')
const { USERNAME_EXISTS, USERNAME_NOT_EXISTS, EMAIL_IN_USE } = require('../ErrorMsgs')
const { EmsError, PK_NOT_EXISTS, PK_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } = require('../../EmsError')
const util = require('util')

class UserRepository {
    #sequelize
    #User

    constructor(sequelize) {
        this.#sequelize = sequelize;
        this.#User = defineUserModel(this.#sequelize);
    }

    /**
     * Adds a new user to the database.
     * @param {*} userData dictionary of user's data, should have keys 'username', 'firstName', 'lastName', 'email', 'password'
     * @returns The added user.
     */
    async addUser(userData) {
        try {
            const newUser = await this.#User.create(userData);
            return newUser;
        } catch (err) {
            // Check if the error is a SequelizeUniqueConstraintError
            if (err.name === 'SequelizeUniqueConstraintError') {
                // Check if the error is related to username or email uniqueness
                err.errors.forEach(err => {
                    if (err.path === 'username') {
                        throw new EmsError(util.format(USERNAME_EXISTS, userData.username), PK_ALREADY_EXISTS);
                    } else if (err.path === 'email') {
                        throw new EmsError(util.format(EMAIL_IN_USE, userData.email), EMAIL_ALREADY_EXISTS);
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
            throw new EmsError(util.format(USERNAME_NOT_EXISTS, username), PK_NOT_EXISTS);
        }
        return foundUser;
    }
}

module.exports = UserRepository;