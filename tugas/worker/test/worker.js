const chai = require('chai'),
    expect = chai.expect;
const sinon = require('sinon');
const { register, listWorker, removeWorker } = require('../lib/worker');
const workerModel = require('../models/worker.model');


describe("Register",function(){
    it("Register should success",function(done){
        const data = {        // anggap bentuk data yang diperoleh dari model
            name: 'budi',
            address: 'Jakarta',
            email: 'bud@mai.com',
            phone: '1234567890',
            biografi: 'makan',
            photo: 'localhost:9999/photo/adasdas.jpg',
        }
        sinon.stub(workerModel,'create').returns('');
        await register
    });
});
