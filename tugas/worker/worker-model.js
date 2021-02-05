const { EntitySchema } = require('typeorm');

class Worker {
  constructor(id, name, alamat, email, telepon, biografi, photo) {
    this.id = id;
    this.name = name;
    this.alamat = alamat;
    this.email = email;
    this.telepon = telepon;
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
    alamat: {
      type: 'varchar',
      length: 255,
    },
    email: {
      type: 'varchar',
      length: 255,
    },
    telepon: {
      type: 'varchar',
      length: 20,
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
