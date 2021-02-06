const { EntitySchema } = require('typeorm');

class Task {
  constructor(id, job, assignee, done, cancel, addedAt) {
    this.id = id;
    this.job = job;
    this.done = done;
    this.cancel = cancel;
    this.addedAt = addedAt;
    this.assignee = assignee;
  }
}

const TaskSchema = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  target: Task,
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    job: {
      type: 'text',
    },
    done: {
      type: 'boolean',
      default: false,
    },
    cancel: {
      type: 'boolean',
      default: false,
    },
    addedAt: {
      type: 'timestamp',
      name: 'added_at',
      nullable: false,
      default: () => 'NOW()',
    },
  },
  relations: {
    assignee: {
      target: 'Worker',
      type: 'many-to-one',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
module.exports = {
  Task,
  TaskSchema,
};
