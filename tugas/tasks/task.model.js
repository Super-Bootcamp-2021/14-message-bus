const { DataTypes } = require('sequelize');

exports.model;

exports.defineModel = function (orm) {
  exports.model = orm.define(
    'task',
    {
      job: DataTypes.TEXT,
      assigneeId: {
        type: DataTypes.INTEGER,
        references: {
          model: exports.worker,
          key: 'id',
        },
      },
      done: {
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
      underscored: true,
    }
  );
};
