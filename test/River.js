
var _     = require('underscore')
, assert  = require('assert')
, River   = require('okdoki/lib/River').River
, Redis   = require('okdoki/lib/Redis').Redis
;

describe( 'River', function () {

  it( 'runs job after the previous one finishes', function (done) {
    var r = River.new();
    var results = [];

    var fin = function (job) {
      return function (err, reply) {
        if(err)
          return job.error(err, reply);
        job.finish(reply)
      };
    };

    r.job('del: ', 'job-keys', function (j) {
      Redis.client.del('job-keys', fin(j));
    });

    r.job('pop: ', 0, function (j) {
      Redis.client.lpop('job-keys', fin(j));
    });

    r.job('insert: ', 1, function (j) {
      process.nextTick( function() {
        Redis.client.rpush('job-keys', j.id, fin(j));
      });
    });

    r.job('pop: ', 1, function (j) {
      Redis.client.lpop('job-keys', fin(j));
    });

    r
    .run_and_on_finish(function () {
      assert.deepEqual([null, 1, '1'], _.flatten(r.results.slice(1), 1));
      done();
    });
  });

  describe( 'on_job', function () {
    it( 'runs event only in job', function (done) {
      var results = [];
      var r = River.new();
      r
      .on_job('invalid', function (msg, j) {
        assert.equal(j.invalid_msg, 'done');
        done();
      })
      .job('push', 'done', function (j) {
        j.invalid('done');
      })
      .run();
    });
  }); // === describe

  describe( '.invalid', function () {
    it( 'stops river', function (done) {
      var r = River.new();
      var job = null;
      r
      .job('runs', 1, function (j) {
        j.finish(j.id);
      })
      .job('runs', 2, function (j) {
        j.finish(j.id)
      })
      .job('runs', 3, function (j) {
        job = j;
        j.invalid(j.id);
        j.finish(j.id);
      })
      .job('runs', 4, function (j) {
        j.finish(j.id)
      })
      .run_and_on_finish(function () {
        throw new Error('This is not suppose to run.');
      });
      assert.deepEqual(_.flatten(r.results, 1), [1,2]);
      assert.equal(job.invalid_msg, 3);
      done();
    });
  }); // === describe

  describe( '.error', function () {
    it( 'stops river', function (done) {
      var results = [];
      var r = River.new();
      r
      .on('error', function (err, j) {
        results.push([j.id, j.error_msg]);
      })
      .job('emit error', 1, function (j) {
        j.error("done");
      })
      .job('emit error', 2, function (j) {
        j.error("done");
      })
      .run_and_on_finish(function (r) {
        throw new Error('This is not supposed to be run after .error().');
      });
      assert.deepEqual(results, [[1, 'done']]);
      done();
    });
  }); // === describe


  describe( '.not_found', function () {
    it( 'stops river', function (done) {
      var results = [];
      var r = River.new();
      r
      .on_job('not_found', function (msg, j) {
        results.push([j.id, j.not_found_msg]);
      })
      .job('emit not_found', 1, function (j) {
        j.not_found("done");
      })
      .job('emit error', 2, function (j) {
        throw new Error('This is not supposed to be run after .not_found().');
      })
      .run_and_on_finish(function (r) {
        throw new Error('This is not supposed to be run after .not_found().');
      });
      assert.deepEqual(results, [[1, 'done']]);
      done();
    });
  }); // === describe


}); // === describe
