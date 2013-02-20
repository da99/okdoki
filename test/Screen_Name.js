var _         = require('underscore')
, assert      = require('assert')
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, River       = require('okdoki/lib/River').River
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
, h           = require('okdoki/test/helpers')
;

var c = null;
var sn = 'SN_1';
var sn_updated = 'SN_1_UPDATED';

describe( 'Screen_Name', function () {

  before(function (done) {
    PG.new('delete all screen_names and customers')
    .delete_all('screen_names')
    .delete_all('customers')
    .run_and_on_finish(function (meta) {
      done();
    });
  });

  after(function (done) {
    done();
  });

  describe( 'create:', function () {
    it( 'saves screen_name to datastore', function (done) {
      var c = {new_data: {ip: '000000', screen_name: 'mem1'}, data: {id: 'C1'}, push_screen_name_row: function (r) { this.row = r;}};
      River.new()
      .job('create sn', 'mem1', function (j) {
        Screen_Name.create(c, j);
      })

      .job('read sn', 'mem1', function (j) {

        PG.run(j, SQL
               .select('*')
               .from('screen_names')
               .where('screen_name = UPPER( $1 )', [j.id])
               .limit(1)
              );

      })

      .run_and_on_finish(function (r) {
        var sn = r.last_reply();
        assert.equal(sn.screen_name, 'mem1'.toUpperCase());
        done();
      });
    }); // it

  }); // === describe create


  describe( 'update:', function () {


    before(function (done) {
      var c_opts = {
        screen_name         : sn.toLowerCase(),
        pass_phrase         : "this is a pass phrase",
        confirm_pass_phrase : "this is a pass phrase",
        ip                  : '000.00.000'
      };

      River.new()
      .job('create', 'customer', [Customer, 'create', c_opts])
      .run_and_on_finish(function (r) {
        c = r.last_reply();
        done();
      });
    });

    it( 'updates screen name', function (done) {

      var sn_opts = {
        old_screen_name : sn,
        screen_name     : sn_updated.toLowerCase()
      };

      River.new()

      .job('update', 'screen name', function (j) {
        c.new_data = sn_opts;
        Screen_Name.update(c, j);
      })

      .run_and_on_finish(function (r) {
        assert.deepEqual(c.screen_names(), [sn_updated]);
        sn = sn_updated;
        done();
      });

    }); // it
  }); // === describe update

  describe( 'trash', function () {


    it( 'it updates screen-name\'s trashed_at column', function (done) {
      var f = '%Y-%m-%dT%H:%M';
      River.new()
      .job('trash', sn, [Screen_Name, 'trash', c.screen_name_id(sn)])
      .run_and_on_finish(function (r) {
        assert.equal(h.is_recent(r.last_reply().trashed_at), true);
        done();
      });
    });

  }); // === describe trash

  describe( 'delete', function () {

    it( 'it deletes screen-name record of more than 2 days old', function (done) {
      River.new()
      .job('age', 'trashed screen name', function (j) {
        PG.new()
        .q(SQL
           .update(Screen_Name.TABLE_NAME)
           .set({trashed_at: h.ago('-3d')})
           .where('screen_name', sn)
          )
        .run_and_on_finish(j.finish);
      })
      .job('deletes old', 'screen names', [Screen_Name, 'delete_trashed'])
      .job('read', 'screen names', [Customer, 'read_by_id', c.data.id])
      .run_and_on_finish(function (r) {
        assert.equal(r.last_reply().screen_names().length, 0);
        done();
      });
    });

  }); // === describe delete

}); // === describe Screen_Name




