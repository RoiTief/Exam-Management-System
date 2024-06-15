const {DataTypes} = require("sequelize");

/**
 * Defines a 'Keyword' model within the given database
 */
function defineKeywordModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === 'Keyword') ?
        sequelize.models.Keyword :
        sequelize.define('Keyword', {
                word: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    allowNull: false,
                },
            }
        );
}

module.exports = defineKeywordModel;
