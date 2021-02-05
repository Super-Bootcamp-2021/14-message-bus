const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Sequelize, Model } = require('sequelize');

/**
 * @typedef {Object} Worker
 * @property {string} name
 * @property {number} id
 */

/**
 * define worker models
 * @param {Sequelize} orm sequalize instance
 * @returns {Model<Worker>}
 */
function defineWorker(orm) {
  return orm.define(
    'worker',
    {
      nama: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      telepon: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      biografi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: 'workers',
    }
  );
}

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} job
 * @property {boolean} done
 * @property {Date} addedAt
 */

/**
 * define task models
 * @param {Sequelize} orm sequalize instance
 * @returns {Model<Task>}
 */
function defineTask(orm) {
  return orm.define(
    'task',
    {
      job: DataTypes.TEXT,
      attachment: {
        type: DataTypes.TEXT,
        defaultValue: true,
      },
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancel: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      added_at: {
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
  defineWorker,
  defineTask,
};
