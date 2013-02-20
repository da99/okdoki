
var _     = require('underscore')
, assert  = require('assert')
, River   = require('okdoki/lib/River').River
, Redis   = require('okdoki/lib/Redis').Redis
;

describe( 'River', function () {

  before(function (done) {
    Redis.connect();
    done();
  });

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

    r
    .job('del: ', 'job-keys', function (j) {
      Redis.client.del('job-keys', fin(j));
    })

    .job('pop: ', 0, function (j) {
      Redis.client.lpop('job-keys', fin(j));
    })

    .job('insert: ', 1, function (j) {
      process.nextTick( function() {
        Redis.client.rpush('job-keys', j.id, fin(j));
      });
    })

    .job('pop: ', 1, function (j) {
      Redis.client.lpop('job-keys', fin(j));
    })

    .run_and_on_finish(function () {
      assert.deepEqual([null, 1, '1'], _.flatten(r.replys.slice(1), 1));
      done();
    })
    ;

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

    it( 'throws Error if no invalid handler defined', function (done) {
      var results = [];
      var r = River.new();
      r
      .job('throw', 'done', function (j) {
        var e = null;
        try {
          j.invalid('done');
        } catch(err) {
          e = err;
        }
        assert(e.message, 'done');
        done();
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

      .on_job('invalid', function () { return;})
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
      assert.deepEqual(_.flatten(r.replys, 1), [1,2]);
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

  describe( 'group/id', function () {
    it( 'group/id are optional', function (done) {
      var val = null;
      River.new()
      .job(function (j) {
        val = j.group + ' ' + j.id;
        j.finish(val);
      })
      .on_finish(function (r) {
        assert.equal(val, 'no group 1');
        done();
      })
      .run()
      ;
    });
  }); // === describe

  describe( 'inheriting a job', function () {

    it( 'runs the events of the previous job.river', function (done) {
      River.new()
      .on_error(function (msg) {
        assert.equal(msg, 'reached');
        done();
      })
      .job(function (j) {

        River.new(j)
        .job(function (j) {
          j.error('reached');
        })
        .run();

      })
      .run();
    });

    //
    // Parent job's .finish has to be called manually because the .on_finish
    //   callbacks might run other async jobs. Example:
    //
    //     .run_and_on_finish(function () {
    //        Redis.client.hgetall(function () {
    //            original_job.finish(arguments);
    //        });
    //     })
    //
    it( 'parent job\'s .finish has to be called manually', function () {
      var val = 0;
      River.new()
      .job(function (j) {

        River.new(j)
        .job(function (new_j) {
          new_j.finish();
        })
        .run_and_on_finish(function (r) {
        });

      })
      .run_and_on_finish(function (r) {
        ++val;
      });

      assert.equal(val, 0);
    });

    it( 'stops running if parent job has finished', function () {
      var val = 0;
      River.new()
      .on_finish(function (r) {
        ++val;
      })
      .job(function (j) {

        River.new(j)
        .job(function (new_j) {
          j.finish();
          new_j.finish();
        })
        .run_and_on_finish(function (r) {
          throw new Error('Should not be reached.');
        });

      })
      .run();

      assert.equal(val, 1);
    });
  }); // === describe

}); // === describe
