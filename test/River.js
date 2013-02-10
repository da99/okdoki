
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

      var get = function (name, r, i) {
        r.flow.finish(null, i);
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
      var j = River.new();
      var results = [];

      var fin = function (err, reply) {
        j.finish(err, reply)
      };

      j.job('del: ', 'job-keys', function (r) {
        Redis.client.del('job-keys', fin);
      });

      j.job('pop: ', 0, function (r) {
        Redis.client.lpop('job-keys', fin);
      });

      j.job('insert: ', 1, function (r) {
        process.nextTick( function() {
          Redis.client.rpush('job-keys', r.id, fin);
        });
      });

      j.job('pop: ', 1, function (r) {
        Redis.client.lpop('job-keys', fin);
      });

      j
      .run_and_on_finish(function () {
        assert.deepEqual([null, 1, '1'], _.flatten(j.results.slice(1), 1));
        done();
      });
    });
  }); // === describe
}); // === describe
