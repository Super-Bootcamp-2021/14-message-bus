const { DataTypes } = require('sequelize');

function defineTask(orm) {
  return orm.define(
    'task',
    {
      job: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancel: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      'added-at': {
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

module.exports = {
  defineTask,
};
