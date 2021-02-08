const { EntitySchema } = require('typeorm');

class Task {
  constructor(id, job, detail, attach, assignee, done, addedAt) {
    this.id = id;
    this.job = job;
    this.detail = detail;
    this.done = done;
    this.attach = attach;
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
    detail: {
      type: 'text',
    },
    attach: {
      type: 'text',
    },
    done: {
      type: 'int',
      default: 2,
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
    },
  },
});
module.exports = {
  Task,
  TaskSchema,
};
