const {DataTypes} = require("sequelize");

/**
 * Defines a 'Appendix' model within the given database
 */
function defineAppendixModel(sequelize) {
    return sequelize.modelManager.models.some(model => model.name === 'Appendix') ?
        sequelize.models.Appendix :
        sequelize.define('Appendix', {
                tag: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                content: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            }
        );
}

module.exports = defineAppendixModel;
