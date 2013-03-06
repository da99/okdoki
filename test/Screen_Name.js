var _         = require('underscore')
, assert      = require('assert')
, Arango      = require('okdoki/lib/ArangoDB').ArangoDB
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, River       = require('okdoki/lib/River').River
, h           = require('okdoki/test/helpers')
;

var c = null;
var sn = 'SN_1';
var sn_updated = 'SN_1_UPDATED';

describe( 'Screen_Name', function () {

  before(function (done) {
    River.new(arguments)
    .job('delete customers', [Customer, 'delete_all'])
    .run(function (meta) {
      done();
    });
  });

  describe( 'create:', function () {
    it( 'saves screen_name to datastore', function (done) {

      var c = {new_data: {ip: '000000', screen_name: 'mem1'}, data: {id: 'C1'}, push_screen_name_row: function (r) { this.row = r;}};
      River.new(null)
      .job('create sn', 'mem1', function (j) {
        Screen_Name.create(c, j);
      })

      .job('read sn', 'mem1', function (j) {
        Arango.new(Screen_Name.TABLE_NAME).read_by_example({
          screen_name: 'mem1'.toUpperCase()
        }, j);
      })

      .reply(function (reply, river) {
        var sn = reply[0];
        assert.equal(sn.screen_name, 'mem1'.toUpperCase());
        done();
      })

      .run();
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

      River.new(null)
      .job('create', 'customer', [Customer, 'create', c_opts])
      .reply(function (last) {
        c = last;
        done();
      })
      .run();
    });

    it( 'updates screen name', function (done) {

      var sn_opts = {
        old_screen_name : sn,
        screen_name     : sn_updated.toLowerCase()
      };

      River.new(null)

      .job('update', 'screen name', function (j) {
        c.new_data = sn_opts;
        Screen_Name.update(c, j);
      })

      .run(function (r) {
        assert.deepEqual(c.screen_names(), [sn_updated]);
        sn = sn_updated;
        done();
      });

    }); // it
  }); // === describe update

  describe( 'trash', function () {


    it( 'it updates screen-name\'s trashed_at column', function (done) {
      var f = '%Y-%m-%dT%H:%M';
      River.new(null)
      .job('trash', sn, [Screen_Name, 'trash', c.screen_name_id(sn)])
      .run(function (r) {
        assert.equal(h.is_recent(r.last_reply().trashed_at), true);
        done();
      });
    });

  }); // === describe trash

  describe( 'delete', function () {

    it( 'it deletes screen-name record of more than 2 days old', function (done) {
      River.new(null)
      .job('age', 'trashed screen name', function (j) {
        Arango
        .new(Screen_Name.TABLE_NAME)
        .update(SOME_ID, {trashed_at: h.ago('-3d')}, j)
      })
      .job('deletes old', 'screen names', [Screen_Name, 'delete_trashed'])
      .job('read', 'screen names', [Customer, 'read_by_id', c.data.id])
      .run(function (r) {
        assert.equal(r.last_reply().screen_names().length, 0);
        done();
      });
    });

  }); // === describe delete

}); // === describe Screen_Name




