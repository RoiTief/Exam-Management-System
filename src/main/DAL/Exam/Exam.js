/**
 * Defines a 'Exam' model within the given database
 */
function defineExamModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === "Exam") ?
        sequelize.models.Exam :
        sequelize.define("Exam", {
            // All fields beside id is many to many
        });
}

module.exports = defineExamModel;
