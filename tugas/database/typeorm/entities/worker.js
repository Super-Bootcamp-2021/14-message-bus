const { EntitySchema } = require('typeorm');

class Worker {
  constructor(id, name, address, email, nohp, biografi, photo) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.nohp = nohp;
    this.biografi = biografi;
    this.photo = photo;

  }
}

const WorkerSchema = new EntitySchema({
  name: 'Worker',
  target: Worker,
  tableName: 'workers',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    address: {
      type: 'varchar',
      length: 255,
    },
    email: {
      type: 'varchar',
      length: 255,
    },
    nohp: {
      type: 'varchar',
      length: 255,
    },
    biografi: {
      type: 'varchar',
      length: 255,
    },
    photo: {
      type: 'varchar',
      length: 255,
    },
  },
});

module.exports = {
  Worker,
  WorkerSchema,
};
