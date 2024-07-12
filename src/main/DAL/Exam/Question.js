const {DataTypes} = require("sequelize");


/**
 * Defines a 'Question' model within the given database
 */
function defineQuestionModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "Question") ?
        sequelize.models.Question :
        sequelize.define("Question", {
            ordinal: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        });
}

module.exports = defineQuestionModel;
