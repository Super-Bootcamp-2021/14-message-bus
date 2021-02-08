/* eslint-disable no-unused-vars */
const { DataTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Sequelize, Model } = require('sequelize');

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} job
 * @property {string} status
 * @property {string} document
 * @property {Date} addedAt
 */

/**
 * define task models
 * @param {Sequelize} orm sequalize instance
 * @returns {Model<Task>}
 */
//variables that attached to the "tasks"
function defineTask(orm) {
  return orm.define(
    'task',
    {
      job: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      document: DataTypes.TEXT,
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

module.exports = {
  defineTask,
};
