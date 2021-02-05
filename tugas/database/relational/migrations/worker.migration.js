const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Sequelize, Model } = require('sequelize');

function defineWorker(orm) {
    return orm.define(
      'worker',
      {
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        biografi: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        photo: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: 'workers',
      }
    );
}

module.exports = {defineWorker}