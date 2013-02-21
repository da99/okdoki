var _      = require('underscore')
, assert   = require('assert')
, IM       = require('okdoki/lib/IM').IM
, SQL      = require('okdoki/lib/SQL').SQL
, PG       = require('okdoki/lib/PG').PG
, River    = require('okdoki/lib/River').River
, Customer = require('okdoki/lib/Customer').Customer
, h        = require('okdoki/test/helpers')
;

describe( 'IM', function () {

  var sn   = 'im_auth_1';
  var sn_2 = 'im_auth_2';
  var sn_3 = 'im_auth_3';

  var c, c2, c3;

  before(function (done) {
    River.new()
    .job('clear',  [Customer, 'delete_all'])
    .job('create', sn,   [Customer, 'create_sample', sn])
    .job('create', sn_3, [Customer, 'create_sample', sn_3])
    .job('create', sn_2, [Customer, 'create_sample', sn_2])
    .run_and_on_finish(function (r) {
      c  = r.reply_for('create', sn);
      c2 = r.reply_for('create', sn_2);
      c3 = r.reply_for('create', sn_3);
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

