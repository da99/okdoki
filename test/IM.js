var _    = require('underscore')
, assert = require('assert')
, IM     = require('okdoki/lib/IM').IM
, Redis  = require('okdoki/lib/Redis').Redis
;

describe( 'IM create_im:', function () {

  it( 'saves im', function (done) {

    var o = {
      from : 'mem1',
      body : 'This is an im body.'
    };

    IM.create(o, function (im) {
      Redis.client.hgetall(im.id, function (e, r) {
        assert.equal(r.body, o.body);
        done();
      });
    });

  });

  it( 'sets an expire time', function (done) {

    var o = {
      from: 'mem2',
      body: 'something'
    };

    IM.create(o, function (im) {
      Redis.client.ttl(im.id, function (e, r) {
        assert.equal(r > IM.expire_in && r <= 10, true);
        done();
      });
    });

  });

  it( 'update expire time of ims group', function (done) {

    var o = {
      from: 'u1',
      body: "something"
    };

    IM.create(o, function (im) {
      Redis.client.ttl('u1:ims', function (e, r) {
        assert.equal(r > IM.expire_in && r <= 10, true);
        done();
      });
    });
  });

}); // === describe

describe( 'IM read', function () {

  it( 'retrieves ims', function (done) {

    var multi = Redis.client.multi();
    var body  = ['Yo yo: 1', 'Yo yo:2 '];

    multi.hmset('f1:ims', {'f1:1': 1});
    multi.hmset('f1:ims', {'f1:2': 1});
    multi.hmset('f1:1', {'body': body[0]});
    multi.hmset('f1:2', {'body': body[1]});
    multi.hmset('u2:c', {'f1':1});
    multi.exec(function (err, replys) {
      IM.read('u2', {finish: function (r) {
        assert.deepEqual(_.pluck(r, 'body'), body);
        done();
      }});
    });

  });
}); // === describe


