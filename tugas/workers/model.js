const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Sequelize, Model } = require('sequelize');

//variables that attached to the "workers"
function defineWorker(orm) {
  //nama, alamat, email, no-telp, biografi singkat
  return orm.define(
    'worker',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(127),
        allowNull: false,
      },
      telephone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      biography: {
        type: DataTypes.TEXT,
      },
      photo: {
        type: DataTypes.STRING(255),
      },
    },
    {
      timestamps: false,
      tableName: 'workers',
    }
  );
}

module.exports = {
  defineWorker,
};
