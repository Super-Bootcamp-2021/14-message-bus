const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.use(chaiHttp);

describe('Task tests', () => {
  it('Should Get All Tasks', function (done) {
    chai
      .request(server)
      .get('/task')
      .end((err, res) => {
        this.timeout(500);
        expect(res.header).to.have.property('content-type');
        expect(res.status).to.eq(200);
        done();
      });
  });

  const input = { id: 70, name: 'makan', isCompleted: false };
  it('Should Create New Task', function (done) {
    chai
      .request(server)
      .post('/task')
      .send(input)
      .end((err, res) => {
        this.timeout(300);
        // expect(res.header).to.have.property('content-type');
        expect(res.body.name).to.eq(input.name);
        expect(res.body.isCompleted).to.eq(input.isCompleted);
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('Should Update Task', function (done) {
    const updatedInput = { isCompleted: true };
    chai
      .request(server)
      .put(`/task/${input.id}`)
      .send(updatedInput)
      .end((err, res) => {
        this.timeout(500);
        expect(res.header).to.have.property('content-type');
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('Should Delete a Task', function (done) {
    chai
      .request(server)
      .delete(`/task/${input.id}`)
      .end((err, res) => {
        this.timeout(800);
        expect(res.header).to.have.property('content-type');
        expect(res.status).to.eq(200);
        done();
      });
  });
});

describe('Another Route Tests', () => {
  it("Shouldn't catch worker route", function (done) {
    chai
      .request(server)
      .get('/worker')
      .end((err, res) => {
        this.timeout(200);
        expect(res.status).to.eq(404);
        done();
      });
  });

  it("Shouldn't return specify task", function (done) {
    chai
      .request(server)
      .get('/task/1')
      .end((err, res) => {
        this.timeout(300);
        expect(res.statusCode).to.eq(404);
        done();
      });
  });

  it("Shouldn't catch DELETE method", function (done) {
    chai
      .request(server)
      .delete('/task')
      .end((err, res) => {
        this.timeout(300);
        expect(res.statusCode).to.eq(404);
        done();
      });
  });

//   context('Return an error from Controller', function () {
//     it("Shouldn't get Data from Database", function (done) {
//       chai
//         .request(server)
//         .post('/task')
//         .end((err, res) => {
//           this.timeout(200);
//           console.log(err);
//           done();
//         });
//     });
//   });
});
