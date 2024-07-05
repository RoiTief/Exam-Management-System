const {DataTypes} = require("sequelize");

/**
 * Defines a 'Question' model within the given database
 */
function defineQuestionAnswerModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "QuestionAnswer") ?
        sequelize.models.QuestionAnswer :
        sequelize.define("QuestionAnswer", {
            version:{
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            answerId:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                foreignKey: true
            },
            questionId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                foreignKey: true
            },
            ordinal: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        });
}

module.exports = defineQuestionAnswerModel;
