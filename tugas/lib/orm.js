const { Sequelize } = require('sequelize');
const taskModel = require('../tasks/task.model');
const workerModel = require('../worker/worker.model');

exports.orm;

/**
 * connect and sync database schema
 * @param {string} database database name
 * @param {string} username connection username
 * @param {string} password caonnection password
 * @param {any} config additional sequelize configs
 */
exports.connect = async function (database, username, password, config) {
  exports.orm = new Sequelize(database, username, password, {
    ...config,
    logging: false,
    timestamps: false,
  });
  exports.orm.authenticate();
  initRelationship();
  exports.orm.sync({ alter: true });
};

/**
 * initiate model relationship
 */
function initRelationship() {
  taskModel.defineModel(exports.orm);
  workerModel.defineModel(exports.orm);

  taskModel.model.belongsTo(workerModel.model, {
    onDelete: 'cascade', // set null, restrict
    foreignKey: 'assigneeId',
  });
}
