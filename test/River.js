
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
      .on_next('invalid', function (j) {
        assert.equal(j.job.about_error.msg, 'don');
        assert.equal(j.job.is_job, true);
        d();
      })
      .job('push', 'don', function (j) {
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

      .on_next('invalid', function (j) {
        assert(j.job.about_error.msg, 3);
      })

      .job('runs', 3, function (j) {
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
      .on('error', function (flow) {
        var river = flow.river;
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
      .on('error', function (flow) {
        var r = flow.river;
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

  describe( '.next_empty', function () {

    _.each([null, undefined, false, 0], function (v) {
      it( 'runs function on a "' + v + '" response.', function () {
        var rep = "none";
        River.new(null).next_empty(function (j, last_reply) {
          rep = 'empty';
          j.finish(rep)
        })
        .job(function (j) { j.finish(v) })
        .run();
        assert.equal(rep, 'empty');
      });

      it( 'passes last reply to user-defined callback', function () {
        var rep = "none";
        River.new(null).next_empty(function (j, last_reply) {
          rep = last_reply;
          j.finish(rep)
        })
        .job(function (j) { j.finish(v) })
        .run();
        assert.equal(rep, v);
      });

    });

    it( 'does not run if reply is less than 0', function () {
      var rep = "none";
      River.new(null).next_empty(function (j, last_reply) {
        rep = 'ran';
        j.finish(rep)
      })
      .job(function (j) { j.finish(-1) })
      .run();
      assert.equal(rep, 'none');
    });

    it( 'runs on whitespace string', function () {
      var rep = "none";
      River.new(null).next_empty(function (j, last_reply) {
        rep = 'ran';
        j.finish(rep)
      })
      .job(function (j) { j.finish("  ") })
      .run();
      assert.equal(rep, 'ran');
    });

    it( 'does not run on object', function () {
      var rep = "none";
      River.new(null).next_empty(function (j, last_reply) {
        rep = 'ran';
        j.finish(rep)
      })
      .job(function (j) { j.finish({}) })
      .run();
      assert.equal(rep, 'none');
    });

  }); // === end desc

  describe( '.first_reply', function () {
    it( 'returns .val of first reply of .replys', function () {
      var r = River.new(null)
      .job(function (j) { j.finish(1); })
      .job(function (j) { j.finish(2); })
      .job(function (j) { j.finish(3); })
      .run();
      assert.equal(r.first_reply(), 1);
    });
  }); // === end desc

  describe( '.last_reply', function () {
    it( 'returns .val of last reply of .replys', function () {
      var r = River.new(null)
      .job(function (j) { j.finish(1); })
      .job(function (j) { j.finish(2); })
      .job(function (j) { j.finish(3); })
      .run();
      assert.equal(r.last_reply(), 3);
    });
  }); // === end desc

}); // === describe
