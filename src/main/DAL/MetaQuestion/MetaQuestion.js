const {DataTypes , Model} = require("sequelize");
const {META_QUESTION_TYPES} = require("../../Enums");

/**
 * Defines a 'MetaQuestion' model within the given database
 */
function defineMetaQuestionModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === 'MetaQuestion') ?
        sequelize.models.MetaQuestion :
        sequelize.define('MetaQuestion', {
            stem: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
}

module.exports = defineMetaQuestionModel;
