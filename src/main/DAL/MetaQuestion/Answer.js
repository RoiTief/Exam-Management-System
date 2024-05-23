const {DataTypes} = require("sequelize");
const {ANSWER_TYPES} = require("../../Enums");

/**
 * Defines a 'Answer' model within the given database
 */
function defineAnswerModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === 'Answer') ?
        sequelize.models.Answer :
        sequelize.define('Answer', {
                content: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                tag: {
                    type: DataTypes.ENUM,
                    values: Object.values(ANSWER_TYPES),
                    allowNull: false
                },
                explanation: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
            }
        );
}

module.exports = defineAnswerModel;
