var _    = require('underscore')
, assert = require('assert')
, RSN    = require('okdoki/lib/Screen_Name').Redis_Screen_Name
, Redis  = require('okdoki/lib/Redis').Redis
;

before(function (done) {
  RSN(Redis.client);
  done();
});

after(function (done) {
  Redis.client.quit();
  done();
});

describe( 'Redis_Screen_Name', function () {

  describe( 'create_im', function () {
    it( 'saves im', function (done) {
      var body = 'Yo yo.';
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: body}, function (e, r, m) {
        Redis.client.hget(m.id, 'body', function (e, r) {
          assert.equal(r, body);
          done();
        });
      });
    });

    it( 'sets an expire time', function (done) {
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: "something"}, function (e, r, m) {
        Redis.client.ttl(m.id, function (e, r) {
          assert.equal(r > RSN.expire_in && r <= 10, true);
          done();
        });
      });
    });

    it( 'update expire time of msgs group', function (done) {
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: "something"}, function (e, r, m) {
        Redis.client.ttl('u1:msgs', function (e, r) {
          assert.equal(r > RSN.expire_in && r <= 10, true);
          done();
        });
      });
    });
  }); // === describe

  describe( 'read_ims', function () {
    it( 'retrieves ims', function (done) {
      var multi = Redis.client.multi();
      var body = ['Yo yo: 1', 'Yo yo:2 '];
      var rsn  = RSN.new('u2');

      multi.hmset('f1:msgs', {'f1:1': 1});
      multi.hmset('f1:msgs', {'f1:2': 1});
      multi.hmset('f1:1', {'body': body[0]});
      multi.hmset('f1:2', {'body': body[1]});
      multi.hmset('u2:c', {'f1':1});
      multi.exec(function (err, replys) {
        rsn.read_ims(function (r) {
          assert.deepEqual(_.pluck(r, 'body'), body);
          done();
        });
      });

    });
  }); // === describe

}); // === describe

