
var _     = require('underscore')
, assert  = require('assert')
, Jobs    = require('okdoki/lib/Jobs').Jobs
, Redis   = require('okdoki/lib/Redis').Redis
, request = require('request')
;

describe( 'Jobs', function () {

  it( 'runs each job w/o waiting for the previous one to finish', function (done) {
    var j = Jobs.new();
    var results = [];

    _.each(['google', 'bing', 'yahoo'], function (name, i) {
      j.create('get: ', name, function (f) {
        request.get('http://www.' + name + '.com/', function (a,b,data) {
          results.push(i);
          f(data);
        });
      });
    });

    j.run(function () {
      assert.deepEqual([0,1,2], results.sort());
      done();
    });

  });

  describe( 'FIFO', function () {
    it( 'runs job after the previous one finishes', function (done) {
      var j = Jobs.new();
      var results = [];

      j.create('del: ', 'job-keys', function (f, g, id) {
        Redis.client.del('job-keys', f);
      });

      j.create('pop: ', 0, function (f, g, id) {
        Redis.client.lpop('job-keys', f);
      });

      j.create('insert: ', 1, function (f, g, id) {
        Redis.client.rpush('job-keys', id, f);
      });

      j.create('pop: ', 1, function (f, g, id) {
        Redis.client.lpop('job-keys', f);
      });

      j.run_fifo(function () {
        var target = j.replys().slice(1);
        assert.deepEqual([null, 1, '1'], target);
        done();
      });
    });
  }); // === describe
}); // === describe
