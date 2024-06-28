const {DataTypes} = require("sequelize");
const {ANSWER_TYPES} = require("../../Enums");

/**
 * Defines a 'Answer' model within the given database
 */
function defineUserTagAnswerModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === 'UserTagAnswer') ?
        sequelize.models.UserTagAnswer :
        sequelize.define('UserTagAnswer', {
                tag: {
                    type: DataTypes.ENUM,
                    values: Object.values(ANSWER_TYPES),
                    allowNull: false
                },
            }
        );
}

module.exports = defineUserTagAnswerModel;
