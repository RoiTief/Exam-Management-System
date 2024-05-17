const { DataTypes } = require('sequelize');

/**
 * Defines a 'User' model within the given database
 */
function defineUserModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name == 'User') ? 
        sequelize.models.User :
        sequelize.define('User', {
            username: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            }, 
            email: { 
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            } 
        }
    );
}

module.exports = defineUserModel;