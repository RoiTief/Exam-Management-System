const { DataTypes } = require("sequelize");

/**
 * Defines a 'Exam' model within the given database
 */
function defineExamModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "Exam") ?
        sequelize.models.Exam :
        sequelize.define("Exam", {
            examReason: {
                type: DataTypes.STRING,
                allowNull: false
            },
            numVersions: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        });
}

module.exports = defineExamModel;
