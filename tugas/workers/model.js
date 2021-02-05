const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Sequelize, Model } = require('sequelize');

/**
 * @typedef {Object} Worker
 * @property {string} name


/**
 * define worker models
 * @param {Sequelize} orm sequalize instance
 * @returns {Model<Worker>}
 */
function defineWorker(orm) {
  return orm.define(
    'worker',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      adress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      notelp: {
        type: DataTypes.NUMBER(255),
        allowNull: false,
      },
      biografi: {
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

/**
 * @property {string} name
 * @property {string} alamat
 * @property {string} email
 * @property {number} notelp
 * @property {string} biografi
 */

module.exports = {
  defineWorker,
};
