const {DataTypes , Model} = require("sequelize");
const {META_QUESTION_TYPES} = require("../../Enums");

/**
 * Defines a 'MetaQuestion' model within the given database
 */
function defineMetaQuestionModel(sequelize) {
    if (sequelize.modelManager.models.some(model => model.name === 'MetaQuestion')) {
        return sequelize.models.MetaQuestion;
    }
    class MetaQuestion extends Model {}
    MetaQuestion.init({
        stem: {
            type: DataTypes.STRING,
            allowNull: false
        },
        questionType: {
            type: DataTypes.ENUM,
            values: Object.values(META_QUESTION_TYPES),
            allowNull: false
        }
    }, {
       sequelize,
       modelName: 'MetaQuestion',
    });
    return sequelize.models.MetaQuestion;
}

module.exports = defineMetaQuestionModel;
