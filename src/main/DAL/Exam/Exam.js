const { DataTypes } = require("sequelize");

/**
 * Defines a 'Exam' model within the given database
 */
function defineExamModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "Exam") ?
        sequelize.models.Exam :
        sequelize.define("Exam", {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
}

module.exports = defineExamModel;
