
var _              = require('underscore');
var assert         = require('assert');
var Redis          = require('okdoki/lib/Redis').Redis;

describe( 'Redis', function () {

  it( 'saves results of each command', function (done) {
    var  R = Redis.new();
    R.add('r1', 'set', ['r1', '1']);
    R.add('r2', 'set', ['r2', '2']);
    R.exec(function () {
      assert.equal(R.replys['r1'].reply, "OK");
      assert.equal(R.replys['r2'].reply, "OK");
      done();
    });
  });

  it( 'runs commands inside commands', function (done) {
    var  R = Redis.new();

    R.add('r1', 'set', ['r1', '1'], function () {

      R.add('r2', 'set', ['r2', '2'], function () {
        assert.equal(R.replys['r1'].reply, "OK");
        assert.equal(R.replys['r2'].reply, "OK");
        done();
      });

    });

    R.exec();
  });

  it( 'runs commands in fin function', function (done) {
    var R = Redis.new();

    R.add('r1', 'set', ['r1', '1']);

    R.exec(function () {
      R.add('r2', 'set', ['r2', '2'], function () {
        R.add('r3', 'set', ['r3', '3'], function () {
          assert.equal(R.replys['r1'].reply, "OK");
          assert.equal(R.replys['r2'].reply, "OK");
          assert.equal(R.replys['r3'].reply, "OK");
          done();
        });
      });

    });
  });

  it( 'runs fin function only once', function (done) {
    var R = Redis.new();
    var count = 0;
    R.add('r1', 'set', ['r1', '1']);
    R.exec(function () {
      count += 1;
      R.add('r2', 'set', ['r2', '2'], function () {
        R.add('r3', 'set', ['r3', '3'], function () {
          assert.equal(count, 1);
          done();
        });
      });
    });
  });
}); // === describe

