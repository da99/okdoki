var _      = require('underscore')
, assert   = require('assert')
, IM       = require('okdoki/lib/IM').IM
, SQL      = require('okdoki/lib/SQL').SQL
, PG       = require('okdoki/lib/PG').PG
, River    = require('okdoki/lib/River').River
, Customer = require('okdoki/lib/Customer').Customer
;

describe( 'IM create_im:', function () {

  var sn = 'im_auth_1';
  var c  = null;

  before(function (done) {
    var o = {
      screen_name: sn,
      pass_phrase: "this is a pass",
      confirm_pass_phrase: "this is a pass",
      ip: '000.00.000'
    };

    River.new()
    .job('clear previous', function (j) {
      PG.new('clear customers', j)
      .delete_all('customers')
      .delete_all('screen_names')
      .run()
    })
    .job('create customer', [Customer, 'create', o])
    .run_and_on_finish(function (r) {
      c = r.last_reply();
      done();
    });
  });

  it( 'saves im', function (done) {

    var o = {
      from : sn,
      body : 'This is an im body.'
    };

    River.new()
    .job('create', [IM, 'create', o])
    .job('read', function (j) {
      PG.new(j)
      .q(SQL.select('*').from(IM.TABLE_NAME).where('id', j.river.last_reply().data.id).limit(1))
      .run()
    })
    .run_and_on_finish(function (river) {
      var r = river.last_reply();
      assert.equal(r.body, o.body);
      done();
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


