const { DataTypes } = require('sequelize');

exports.model;

exports.defineModel = function (orm) {
  exports.model = orm.define(
    'worker',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      age: DataTypes.INTEGER,
      bio: DataTypes.TEXT,
      address: DataTypes.TEXT,
      photo: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'workers',
    }
  );
};
