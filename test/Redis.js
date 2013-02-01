
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
}); // === describe

