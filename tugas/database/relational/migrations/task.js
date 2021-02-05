const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars

function defineTask(orm) {
    return orm.define(
        'task',
        {
            name: DataTypes.STRING,
            attachment: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            isCompleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            addedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: 'tasks',
        }
    );
}



module.exports = { defineTask };
