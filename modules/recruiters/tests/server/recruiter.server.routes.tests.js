'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recruiter = mongoose.model('Recruiter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  recruiter;

/**
 * Recruiter routes tests
 */
describe('Recruiter CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Recruiter
    user.save(function () {
      recruiter = {
        name: 'Recruiter name'
      };

      done();
    });
  });

  it('should be able to save a Recruiter if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Recruiter
        agent.post('/api/recruiters')
          .send(recruiter)
          .expect(200)
          .end(function (recruiterSaveErr, recruiterSaveRes) {
            // Handle Recruiter save error
            if (recruiterSaveErr) {
              return done(recruiterSaveErr);
            }

            // Get a list of Recruiters
            agent.get('/api/recruiters')
              .end(function (recruitersGetErr, recruitersGetRes) {
                // Handle Recruiters save error
                if (recruitersGetErr) {
                  return done(recruitersGetErr);
                }

                // Get Recruiters list
                var recruiters = recruitersGetRes.body;

                // Set assertions
                (recruiters[0].user._id).should.equal(userId);
                (recruiters[0].name).should.match('Recruiter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Recruiter if not logged in', function (done) {
    agent.post('/api/recruiters')
      .send(recruiter)
      .expect(403)
      .end(function (recruiterSaveErr, recruiterSaveRes) {
        // Call the assertion callback
        done(recruiterSaveErr);
      });
  });

  it('should not be able to save an Recruiter if no name is provided', function (done) {
    // Invalidate name field
    recruiter.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Recruiter
        agent.post('/api/recruiters')
          .send(recruiter)
          .expect(400)
          .end(function (recruiterSaveErr, recruiterSaveRes) {
            // Set message assertion
            (recruiterSaveRes.body.message).should.match('Please fill Recruiter name');

            // Handle Recruiter save error
            done(recruiterSaveErr);
          });
      });
  });

  it('should be able to update an Recruiter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Recruiter
        agent.post('/api/recruiters')
          .send(recruiter)
          .expect(200)
          .end(function (recruiterSaveErr, recruiterSaveRes) {
            // Handle Recruiter save error
            if (recruiterSaveErr) {
              return done(recruiterSaveErr);
            }

            // Update Recruiter name
            recruiter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Recruiter
            agent.put('/api/recruiters/' + recruiterSaveRes.body._id)
              .send(recruiter)
              .expect(200)
              .end(function (recruiterUpdateErr, recruiterUpdateRes) {
                // Handle Recruiter update error
                if (recruiterUpdateErr) {
                  return done(recruiterUpdateErr);
                }

                // Set assertions
                (recruiterUpdateRes.body._id).should.equal(recruiterSaveRes.body._id);
                (recruiterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Recruiters if not signed in', function (done) {
    // Create new Recruiter model instance
    var recruiterObj = new Recruiter(recruiter);

    // Save the recruiter
    recruiterObj.save(function () {
      // Request Recruiters
      request(app).get('/api/recruiters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Recruiter if not signed in', function (done) {
    // Create new Recruiter model instance
    var recruiterObj = new Recruiter(recruiter);

    // Save the Recruiter
    recruiterObj.save(function () {
      request(app).get('/api/recruiters/' + recruiterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', recruiter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Recruiter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recruiters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recruiter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Recruiter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Recruiter
    request(app).get('/api/recruiters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Recruiter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Recruiter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Recruiter
        agent.post('/api/recruiters')
          .send(recruiter)
          .expect(200)
          .end(function (recruiterSaveErr, recruiterSaveRes) {
            // Handle Recruiter save error
            if (recruiterSaveErr) {
              return done(recruiterSaveErr);
            }

            // Delete an existing Recruiter
            agent.delete('/api/recruiters/' + recruiterSaveRes.body._id)
              .send(recruiter)
              .expect(200)
              .end(function (recruiterDeleteErr, recruiterDeleteRes) {
                // Handle recruiter error error
                if (recruiterDeleteErr) {
                  return done(recruiterDeleteErr);
                }

                // Set assertions
                (recruiterDeleteRes.body._id).should.equal(recruiterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Recruiter if not signed in', function (done) {
    // Set Recruiter user
    recruiter.user = user;

    // Create new Recruiter model instance
    var recruiterObj = new Recruiter(recruiter);

    // Save the Recruiter
    recruiterObj.save(function () {
      // Try deleting Recruiter
      request(app).delete('/api/recruiters/' + recruiterObj._id)
        .expect(403)
        .end(function (recruiterDeleteErr, recruiterDeleteRes) {
          // Set message assertion
          (recruiterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Recruiter error error
          done(recruiterDeleteErr);
        });

    });
  });

  it('should be able to get a single Recruiter that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Recruiter
          agent.post('/api/recruiters')
            .send(recruiter)
            .expect(200)
            .end(function (recruiterSaveErr, recruiterSaveRes) {
              // Handle Recruiter save error
              if (recruiterSaveErr) {
                return done(recruiterSaveErr);
              }

              // Set assertions on new Recruiter
              (recruiterSaveRes.body.name).should.equal(recruiter.name);
              should.exist(recruiterSaveRes.body.user);
              should.equal(recruiterSaveRes.body.user._id, orphanId);

              // force the Recruiter to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Recruiter
                    agent.get('/api/recruiters/' + recruiterSaveRes.body._id)
                      .expect(200)
                      .end(function (recruiterInfoErr, recruiterInfoRes) {
                        // Handle Recruiter error
                        if (recruiterInfoErr) {
                          return done(recruiterInfoErr);
                        }

                        // Set assertions
                        (recruiterInfoRes.body._id).should.equal(recruiterSaveRes.body._id);
                        (recruiterInfoRes.body.name).should.equal(recruiter.name);
                        should.equal(recruiterInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Recruiter.remove().exec(done);
    });
  });
});
