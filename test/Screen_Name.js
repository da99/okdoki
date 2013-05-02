var _         = require('underscore')
, assert      = require('assert')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
, Customer    = require('../Server/Customer/model').Customer
, Screen_Name = require('../Server/Screen_Name/model').Screen_Name
, h           = require('./helpers')
;

var counter = 0;
var c  = null;
var sn = null;
var sn_updated = null;

function create_test_customer(done) {
  sn = "SN_" + counter++;
  sn_updated = "SN_" + counter + "_UPDATED";
  var c_opts = {
    screen_name         : sn.toLowerCase(),
    pass_phrase         : "this is a pass phrase",
    confirm_pass_phrase : "this is a pass phrase",
    ip                  : '000.00.000'
  };

  River.new(null)
  .job('create', 'customer', [Customer, 'create', c_opts])
  .job(function (j, last) {
    c = last;
    if (done)
      done();
  })
  .run();
}

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

      var c = {new_data: {ip: '000000', screen_name: 'mem1'}, data: {id: '0'}, push_screen_name_row: function (r) { this.row = r;}};

      River.new(null)

      .job('create sn', 'mem1', [Screen_Name, 'create', c])

      .job('read sn', 'mem1', function (j) {
        Topogo.new(Screen_Name.TABLE_NAME)
        .read_one({
          screen_name: 'mem1'.toUpperCase()
        }, j);
      })

      .job(function (j, reply) {
        var sn = reply;
        assert.equal(sn.screen_name, 'mem1'.toUpperCase());
        done();
      })

      .run();
    }); // it

  }); // === describe create


  describe( 'update:', function () {

    before(function (done) {
      create_test_customer(done);
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

    before(function (done) {
      create_test_customer(done);
    });

    it( 'it updates screen-name\'s :trashed_at to UTC now', function (done) {
      var f  = '%Y-%m-%dT%H:%M';
      var id = c.screen_name_id(sn);
      River.new(null)
      .job('trash', sn, [Screen_Name, 'trash', id])
      .job('read', function (j) {
        Topogo.new(Screen_Name.TABLE_NAME)
        .read_by_id(id, j)
      })
      .job(function (j, reply) {
        assert.equal(h.is_recent(reply.trashed_at), true);
        done();
      })
      .run();
    });

  }); // === describe trash

  describe( 'untrash', function () {

    before(function (done) {
      create_test_customer(done);
    });

    it( 'it updates screen-name\'s :trashed_at to null', function (done) {
      var f = '%Y-%m-%dT%H:%M';
      var id = c.screen_name_id(sn);
      River.new(null)
      .job('trash',   sn, [Screen_Name, 'trash',      id])
      .job('untrash', sn, [Screen_Name, 'untrash',    id])
      .job('read', function (j) {
        Topogo.new(Screen_Name.TABLE_NAME)
        .read_by_id(id, j)
      })
      .job(function (j, new_sn) {
        assert.equal(new_sn.trashed_at, null);
        j.finish(new_sn);
      })
      .run(function (r) {
        done();
      });
    });

  }); // === describe untrash

  describe( 'delete', function () {

    before(function (done) {
      create_test_customer();
      create_test_customer(done);
    });

    it( 'it deletes screen-name record of more than 2 days old', function (done) {
      var id = c.screen_name_id(sn);
      River.new(null)
      .job('age', 'trashed screen name', function (j) {
        Topogo
        .new(Screen_Name.TABLE_NAME)
        .update(id, {trashed_at: h.ago('-3d')}, j)
      })
      .job('deletes old', 'screen names', [Screen_Name, 'delete_trashed'])
      .job('read', 'screen names', [Customer, 'read_by_id', c.data.id])
      .run(function (r, last) {
        assert.equal(last.screen_names().length, 0);
        done();
      });
    });

  }); // === describe delete

}); // === describe Screen_Name









