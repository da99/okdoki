
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
    var r = River.new(null);
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

    .run(function () {
      assert.deepEqual([null, 1, '1'], _.flatten(r.replys.slice(1), 1));
      done();
    })
    ;

  });

  describe( 'on_job', function () {

    it( 'runs event only in job', function (d) {
      var results = [];
      var r = River.new(null);
      r
      .on_job('invalid', function (msg, j) {
        assert.equal(msg, 'don');
        assert.equal(j.is_job, true);
        d();
      })
      .job('push', 'don', function (j) {
        j.invalid('don');
      })
      .run();
    });

    it( 'throws Error if no invalid handler defined', function () {
      var results = [];
      var r = River.new(null);
      r
      .job('throw', 'done', function (j) {

        var e = null;
        try {
          j.invalid('done');
        } catch(err) {
          e = err;
        }
        assert(e.message, 'done');
      })
      .run();
    });

  }); // === describe

  describe( '.invalid', function () {
    it( 'stops river', function () {
      var r = River.new(null);
      var job = null;
      r
      .on('before', 'job', function (j) {
        // console.log('***: ', j.id)
      });

      r
      .job('runs', 1, function (j) {
        j.finish(j.id);
      })
      .job('runs', 2, function (j) {
        j.finish(j.id)
      })

      .on_job('invalid', function (msg) { assert(msg, 3); })
      .job('runs', 3, function (j) {
        job = j;
        j.invalid(j.id);
        j.finish(j.id);
      })
      .job('runs', 4, function (j) {
        j.finish(j.id)
      })
      .run(function () {
        throw new Error('This is not suppose to run.');
      });

      assert.deepEqual(_.flatten(r.replys, 1), [1,2]);
      assert.equal(job.about_error.msg, 3);
    });
  }); // === describe

  describe( '.error', function () {
    it( 'stops river', function (done) {
      var results = [];
      var r = River.new(null);
      r
      .on('error', function (err, j) {
        results.push([j.id, j.about_error.msg]);
      })
      .job('emit error', 1, function (j) {
        j.error("done");
      })
      .job('emit error', 2, function (j) {
        j.error("done");
      })
      .run(function (r) {
        throw new Error('This is not supposed to be run after .error().');
      });
      assert.deepEqual(results, [[1, 'done']]);
      done();
    });
  }); // === describe


  describe( '.not_found', function () {
    it( 'stops river', function (done) {
      var results = [];
      var r = River.new(null);
      r
      .on_job('not found', function (msg, j) {
        results.push([j.id, j.about_error.msg]);
      })
      .job('emit not found', 1, function (j) {
        j.not_found("done");
      })
      .job('emit error', 2, function (j) {
        throw new Error('This is not supposed to be run after .not_found().');
      })
      .run(function (r) {
        throw new Error('This is not supposed to be run after .not_found().');
      });
      assert.deepEqual(results, [[1, 'done']]);
      done();
    });
  }); // === describe

  describe( 'group/id', function () {
    it( 'group/id are optional', function (done) {
      var val = null;
      River.new(null)
      .job(function (j) {
        val = j.group + ' ' + j.id;
        j.finish(val);
      })
      .on('finish', function (r) {
        assert.equal(val, 'no group 1');
        done();
      })
      .run()
      ;
    });
  }); // === describe

  describe( 'inheriting a job', function () {

    it( 'runs the events of the previous job.river', function () {
      River.new(null)
      .on('error', function (err) {
        assert.equal(err.message, 'reached');
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
    //     .run(function () {
    //        Redis.client.hgetall(function () {
    //            original_job.finish(arguments);
    //        });
    //     })
    //
    it( 'parent job\'s .finish has to be called manually', function () {
      var val = 0;
      River.new(null)
      .job(function (j) {

        River.new(j)
        .job(function (new_j) {
          new_j.finish();
        })
        .run(function (r) {});

      })
      .run(function (r) {
        ++val;
      });

      assert.equal(val, 0);
    });


  }); // === describe

}); // === describe
