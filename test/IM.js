var _         = require('underscore')
, assert      = require('assert')
, IM          = require('okdoki/lib/IM').IM
, SQL         = require('okdoki/lib/SQL').SQL
, Topogo          = require('okdoki/lib/Topogo').Topogo
, River       = require('da_river').River
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Contact     = require('okdoki/lib/Contact').Contact
, h           = require('okdoki/test/helpers')
;

function ids(arr) {
  return _.pluck(arr, 'id');
}

describe( 'IM', function () {

  var sn   = 'im_auth_1';
  var sn_2 = 'im_auth_2';
  var sn_3 = 'im_auth_3';

  var c, c2, c3, im1, im2, im3, test_river;

  before(function (done) {
    River.new(null)
    .job('clear',  [Customer, 'delete_all'])
    .job('create', sn,   [Customer, 'create_sample', sn])
    .job('create', sn_3, [Customer, 'create_sample', sn_3])
    .job('create', sn_2, [Customer, 'create_sample', sn_2])
    .job('update', 'privacy', [h, 'open_screen_names'])
    .job('update', 'vars', function (j) {
      var r = j.river;
      c   = r.reply_for('create', sn);
      c2  = r.reply_for('create', sn_2);
      c3  = r.reply_for('create', sn_3);
      j.finish();
    })
    .job('contact', 'c2->c3', function (j) {
      Contact.create({from: c2, to_screen_name: sn_3}, j);
    })
    .job('contact', 'c3->c2', function (j) {
      Contact.create({from: c3, to_screen_name: sn_2}, j);
    })
    .job('im', 'c1', function (j) {
      var o = { from : sn, body : 'This is an im body.' };
      IM.create(o, j);
    })
    .job('im', 'c2', function (j) {
      var o = { from : sn_2, body : 'This is for sn_3.' };
      IM.create(o, j);
    })
    .job('im', 'c3', function (j) {
      var o = { from : sn_3, body : 'This is for sn_2.' };
      IM.create(o, j);
    })
    .run(function (r) {
      test_river = r;
      im1 = r.reply_for('im', 'c1');
      im2 = r.reply_for('im', 'c2');
      im3 = r.reply_for('im', 'c3');
      done();
    });
  });

  describe( 'create:', function () {
    it( 'saves im', function (done) {

      River.new(null)
      .job('read', function (j) {
        PG.new(j)
        .q(SQL.select('*').from(IM.TABLE_NAME).where('id', im1.data.id).limit(1))
        .run()
      })
      .run(function (river) {
        var r = river.last_reply();
        assert.equal(r.body, 'This is an im body.');
        done();
      });

    });

    it( 'sets created_at', function (done) {

      River.new(null)
      .job('read', 'IM', function (j) {
        PG.new(j)
        .q(SQL.select('created_at').from(IM.TABLE_NAME)
           .where('id', im1.data.id)
           .limit(1)
          )
        .run()
      })
      .job('read', 'now()', function (j) {
        PG.new(j)
        .q(SQL.select("now() AT TIME ZONE 'UTC' as now").limit(1))
        .run()
      })
      .run(function (r) {
        var im  = r.reply_for('read', 'IM');
        var now = r.reply_for('read', 'now()').now;
        assert.equal((now.getTime() - im.created_at.getTime()) < 1000, true);
        done();
      });

    });

  }); // === describe create_im

  describe( 'read_list:', function () {

    it( 'retrieves list ims read_able by intended customer.', function (done) {

      River.new(null)
      .job('read', 'c',  function (j) { IM.read_list(c, j); })
      .job('read', 'c2', function (j) { IM.read_list(c2, j); })
      .job('read', 'c3', function (j) { IM.read_list(c3, j); })
      .run(function (r) {
        assert.equal(r.reply_for('read', 'c').length, 0);
        assert.deepEqual(ids(r.reply_for('read', 'c2')), [im3.data.id]);
        assert.deepEqual(ids(r.reply_for('read', 'c3')), [im2.data.id]);
        done();
      });
    });
  }); // === describe




}); // === describe

