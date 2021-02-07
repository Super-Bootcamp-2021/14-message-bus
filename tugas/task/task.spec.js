const { expect } = require('chai');
const {
  cancel,
  create,
  done,
  update,
  ERROR_CREATE_DATA_INVALID,
} = require('./task');
const { dropTable, read } = require('../lib/database');

describe('task', function () {
  this.timeout(5000);

  it('should create new task', async function () {
    await dropTable();
    const res = await create({
      job: 'membaca buku',
      attachment: 'buku.pdf',
      done: 0,
      cancel: 0,
    });
    expect(res).to.have.property('job', 'membaca buku');
    expect(res).to.have.property('attachment', 'buku.pdf');
    expect(res).to.have.property('done', 0);
    expect(res).to.have.property('cancel', 0);
  });

  it('create new task error', async function (done) {
    function testCreate() {
      create({
        job: '',
        attachment: 'buku.pdf',
        done: 0,
        cancel: 0,
      });
      done();
    }
    expect(testCreate).to.throw(ERROR_CREATE_DATA_INVALID);
  });

  it('job update', async function () {
    const res = await update({
      id: 1,
      job: 'membaca buku novel',
      attachment: 'buku2.pdf',
      done: 0,
      cancel: 0,
    });
    expect(res).to.have.property('job', 'membaca buku novel');
    expect(res).to.have.property('attachment', 'buku2.pdf');
    expect(res).to.have.property('done', 0);
    expect(res).to.have.property('cancel', 0);
  });

  it('job done', async function () {
    await done(1);
    const res = await read(1);
    expect(res).to.have.property('job', 'membaca buku novel');
    expect(res).to.have.property('attachment', 'buku2.pdf');
    expect(res).to.have.property('done', true);
    expect(res).to.have.property('cancel', false);
  });

  it('job cancel', async function () {
    await cancel(1);
    const res = await read(1);
    expect(res).to.have.property('job', 'membaca buku novel');
    expect(res).to.have.property('attachment', 'buku2.pdf');
    expect(res).to.have.property('done', true);
    expect(res).to.have.property('cancel', true);
  });
});
