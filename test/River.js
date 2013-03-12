
var _     = require('underscore')
, assert  = require('assert')
, River   = require('okdoki/lib/River').River
, Redis   = require('okdoki/lib/Redis').Redis
;

function vals(river) {
  if (_.isArray(river))
    var arr = river;
  else
    var arr = river.replys;

  return _.map(arr, function (v) {
    return v.val;
  });
}

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
          return job.finish(err, reply);
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
      assert.deepEqual([null, 1, '1'], vals(_.flatten(r.replys.slice(1), 1)));
      done();
    })
    ;

  });

  describe( 'job.on', function () {

    it( 'runs event only in job', function (d) {
      var results = [];
      var r = River.new(null);
      r
      .job('push', 'don', function (j) {
        j.on('invalid', function (j) {
          assert.equal(j.job.about_error.msg, 'don');
          assert.equal(j.job.is_job, true);
          d();
        })
        j.finish('invalid', 'don');
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
          j.finish('something', 'done');
        } catch(err) {
          e = err;
        }
        assert.equal(e.message, 'something: done');
      })
      .run();
    });

  }); // === describe

  describe( '.invalid', function () {
    it( 'stops river', function () {
      var r = River.new(null);
      var job = null;
      r
      .job('runs', 1, function (j) {
        j.finish(j.id);
      })
      .job('runs', 2, function (j) {
        j.finish(j.id)
      })

      .job('runs', 3, function (j) {
        j.on('invalid', function (j) {
          assert(j.job.about_error.msg, 3);
        });
        job = j;
        j.finish('not_valid', j.id);
      })
      .job('runs', 4, function (j) {
        j.finish(j.id)
      })
      .run(function () {
        throw new Error('Should not get here.');
      });

      assert.deepEqual(vals(r.replys), [1,2]);
      assert.equal(job.about_error.msg, 3);
    });
  }); // === describe

  describe( 'job.error', function () {

    it( 'stops river', function (done) {
      var results = [];
      var r = River.new(null);
      r
      .on('error', function (river) {
        results.push([river.about_error.type, river.about_error.msg]);
      })

      .job('emit error', 1, function (j) {
        j.finish('error', "done");
      })
      .job('emit error', 2, function (j) {
        j.finish('error', "done " + j.id);
      })
      .run(function (r) {
        throw new Error('This is not supposed to be run after .error().');
      });
      assert.deepEqual(results, [['error', 'done']]);
      done();
    });
  }); // === describe


  describe( '.not_found', function () {
    it( 'stops river', function () {
      var results = [];
      var r = River.new(null);
      r
      .job('emit not found', 1, function (j) {
        j.on('not_found', function (flow) {
          var j = flow.job;
          results.push([j.id, j.about_error.msg]);
        })
        j.finish('not_found', "done");
      })
      .job('emit error', 2, function (j) {
        throw new Error('This is not supposed to be run after .not_found().');
      })
      .run(function (r) {
        throw new Error('This is not supposed to be run after .not_found().');
      });
      assert.deepEqual(results, [[1, 'done']]);
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
      .on('error', function (r) {
        assert.equal(r.about_error.msg, 'reached');
      })
      .job(function (j) {

        River.new(j)
        .job(function (j) {
          j.finish('error', 'reached');
        })
        .run();

      })
      .run();
    });

    it( 'stops finishing if any ancesotors have stopped in error', function () {
      var val = 0;

      var b = River.new(null)
      .on('error', function (err) {
        ++val;
      })
      .job(function (j) {
        ++val;
        j.finish(val);
      })
      .job(function (top_j) {

        var a = River.new(top_j)
        .job(function (j) {
          ++val;
          top_j.finish('error', 'reached');
          top_j.finish(val);
          j.finish(val);
        })
        .job(function (j) {
          ++val;
        })
        .run();

        assert.equal(a.replys.length, 0);

      })
      .run();

      assert.deepEqual(vals(b.replys), [1]);
    });


  }); // === describe

  describe.skip( '.finish', function () {
    it("raises error if called 1+ for one job")
    it("finds stopped parent by walking up tree: .parent()")
  }); // === end desc
}); // === describe
