const {DataTypes } = require("sequelize");

/**
 * Defines a 'AppendixMetaQuestion' model within the given database
 */
function defineAppendixMQModel(sequelize) {
    if (sequelize.modelManager.models.some(model => model.name === 'AppendixMQ')) {
        return sequelize.models.AppendixMQ;
    }
    class AppendixMetaQuestion extends sequelize.models.MetaQuestion {}
    AppendixMetaQuestion.init({
        stem: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'AppendixMQ',
        timestamps: false,
    });
    return sequelize.models.AppendixMQ;
}

module.exports = defineAppendixMQModel;
