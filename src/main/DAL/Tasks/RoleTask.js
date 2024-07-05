const {DataTypes, } = require("sequelize");
const {USER_TYPES, CREATED_TASK_TYPES, ANSWER_TYPES, CREATED_TASK_SUPER_TYPES} = require("../../Enums");

/**
 * Defines a 'Answer' model within the given database
 */
function defineRoleTaskModel(sequelize, UserModel) {
    return sequelize.modelManager.models.some(model => model.name === 'RoleTask') ?
        sequelize.models.RoleTask :
        sequelize.define('RoleTask', {
                role: {
                    type: DataTypes.ENUM,
                    values: Object.values(USER_TYPES),
                    allowNull: false
                },
                taskType: {
                    type: DataTypes.ENUM,
                    values: Object.values(CREATED_TASK_TYPES),
                    allowNull: false
                },
                leaveOpen: {
                    // certain tasks you would like to stay open even after completion
                    // e.g. asking all the TAs to create keys/distractors for a given MQ
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                taskData: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                creatingUser: {
                    type: DataTypes.STRING,
                    references: {
                        model: UserModel,
                        key: 'username',
                    },
                    allowNull: false
                }
            }
        );
}

module.exports = defineRoleTaskModel;
