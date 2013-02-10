
var _     = require('underscore')
, assert  = require('assert')
, River   = require('okdoki/lib/River').River
, Redis   = require('okdoki/lib/Redis').Redis
;

describe( 'River', function () {

  describe( 'style: whatever', function () {
    it( 'runs each job w/o waiting for the previous one to finish', function (done) {
      var j = River.new();
      j.style('whatever');
      var i = [];

      var get = function (name, j, i) {
        j.finish(i);
      };

      j.job('get:', 'google', function (r) {
        get(r.id, r, 1);
      });

      j.job('get:', 'bing', function (r) {
        process.nextTick(function () { get(r.id, r, 2); });
      });

      j.job('get:', 'yahoo', function (r) {
        get(r.id, r, 3);
      });

      j.run_and_on_finish(function () {
        assert.deepEqual([1, 3, 2], _.flatten(j.results));
        done();
      });

    });
  }); // === describe

  describe( 'style: line', function () {
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
  }); // === describe

  describe( 'on_job', function () {
    it( 'runs event only in job', function (done) {
      var results = [];
      var r = River.new();
      r
      .on_job('invalid', function (j) {
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
        j.invalid(j.id)
      })
      .job('runs', 4, function (j) {
        j.finish(j.id)
      })
      .run();
      assert.deepEqual(_.flatten(r.results, 1), [1,2]);
      assert.equal(job.invalid_msg, 3);
      done();
    });
  }); // === describe
}); // === describe
