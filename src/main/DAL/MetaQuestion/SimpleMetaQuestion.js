const {DataTypes } = require("sequelize");

/**
 * Defines a 'SimpleMetaQuestion' model within the given database
 */
async function defineSimpleMQModel(metaQuestion) {
    const sequelize = await metaQuestion.sequelize;
    if (sequelize.modelManager.models.some(model => model.name === 'SimpleMQ')) {
        return sequelize.models.SimpleMQ;
    }
    class SimpleMetaQuestion extends metaQuestion {}
    SimpleMetaQuestion.init({
        stem: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        sequelize,
        modelName: 'SimpleMQ',
        timestamps: false,
    });
    return sequelize.models.SimpleMQ;
}

module.exports = defineSimpleMQModel;
