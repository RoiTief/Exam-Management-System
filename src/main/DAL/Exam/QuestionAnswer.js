const { DataTypes } = require("sequelize");

/**
 * Defines a 'Question' model within the given database
 */
function defineQuestionAnswerModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "QuestionAnswer") ?
        sequelize.models.QuestionAnswer :
        sequelize.define("QuestionAnswer", {
            version: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            AnswerId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                foreignKey: true
            },
            QuestionId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                foreignKey: true
            },
            ordinal: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'QuestionAnswer',
            indexes: [
                {
                    unique: true,
                    fields: ['AnswerId', 'QuestionId', 'version'],
                }
            ]
        });
}

module.exports = defineQuestionAnswerModel;
