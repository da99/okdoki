var _      = require('underscore')
, assert   = require('assert')
, IM       = require('okdoki/lib/IM').IM
, SQL      = require('okdoki/lib/SQL').SQL
, PG       = require('okdoki/lib/PG').PG
, River    = require('okdoki/lib/River').River
, Customer = require('okdoki/lib/Customer').Customer
;

describe( 'IM', function () {

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

  describe( 'create_im:', function () {
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

    it( 'sets created_at', function (done) {

      var o = {
        from: sn,
        body: 'something'
      };

      River.new()
      .job('create IM', [IM, 'create', o])
      .job('read', 'IM', function (j) {
        PG.new(j)
        .q(SQL.select('created_at').from(IM.TABLE_NAME)
           .where('id', j.river.last_reply().data.id)
           .limit(1)
          )
          .run()
      })
      .job('read', 'now()', function (j) {
        PG.new(j)
        .q(SQL.select("now() AT TIME ZONE 'UTC' as now").limit(1))
        .run()
      })
      .run_and_on_finish(function (r) {
        var im = r.reply_for('read', 'IM');
        var now = r.reply_for('read', 'now()').now;
        assert.equal((now.getTime() - im.created_at.getTime()) < 100, true);
        done();
      });

    });

  }); // === describe create_im

  describe( 'read_list:', function () {

    it.skip( 'retrieves list ims read_able by intended customer.', function (done) {


    });
  }); // === describe




}); // === describe

