/* eslint-disable no-console */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import queryProivider from '../../queries/index';

chai.use(chaiHttp);
chai.should();

beforeEach(() => {
  const email = 'tester@gmail.com';
  return queryProivider.deleteUserByEmailQuery(email).then((res) => {
    console.log(res);
  }).catch(() => {});
});


describe('UNIT TESTS FOR AUTHENTICATION CONTROLLER', () => {
  describe('/POST REQUEST', () => {
    it('it should login user ', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'sanni@cashenvoy.com',
          password: 'programming',
        })
        .end((err, res) => {
          res.body.should.have
            .property('message')
            .to.equals('Authentication Successful');
          res.body.should.have.property('status').to.equals(200);
          res.body.should.have.property('data').to.be.an('object');
          res.body.should.have.property('token').to.be.a('string');
          done();
        });
    });
    it('it should make a post request if all fields are not empty ', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send({
          lastname: 'Test',
          othername: 'Tester',
          firstname: 'Tester',
          email: 'tester@gmail.com',
          username: 'testbed',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.deep.equal({
            status: 201,
            statusMessage: 'New user created successfully',
          });
          done();
        });
    });

    it('it should not make a post request if some fields are empty ', (done) => {
      const body = {
        lastname: '',
        othername: 'Tester',
        firstname: 'Tester',
        email: 'tester@gmail.com',
        username: 'testbed',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            statusMessage: 'lastname is not allowed to be empty',
          });
          done();
        });
    });

    it('it should not make a post request if a field is not added ', (done) => {
      const body = {
        othername: 'Tester',
        firstname: 'Tester',
        email: 'tester@gmail.com',
        username: 'testbed',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            statusMessage: 'lastname is required',
          });
          done();
        });
    });

    it('it should throw an error when you try to add duplicate data ', (done) => {
      const data = {
        lastname: 'Test',
        othername: 'Tester',
        firstname: 'Tester',
        email: 'sanni@cashenvoy.com',
        username: 'testbed',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            statusMessage:
              'User with this email sanni@cashenvoy.com exists already',
          });
          done();
        });
    });
  });
});
