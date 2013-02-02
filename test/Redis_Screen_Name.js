var _    = require('underscore')
, assert = require('assert')
, RSN    = require('okdoki/lib/Redis_Screen_Name').Redis_Screen_Name
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
      rsn.create_im({body: body}, function (e, r, m) {
        Redis.client.hget(m.id, 'body', function (e, r) {
          assert.equal(r, body);
          done();
        });
      });
    });
  }); // === describe

}); // === describe

