var _         = require('underscore')
, assert      = require('assert')
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Redis       = require('okdoki/lib/Redis').Redis
, River       = require('okdoki/lib/River').River
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
;

describe( 'Screen_Name', function () {

  before(function (done) {
    Screen_Name(Redis.client);
    PG.new('delete all screen_names and customers')
    .delete_all('screen_names')
    .delete_all('customers')
    .run_and_on_finish(function (meta) {
      done();
    });
  });

  after(function (done) {
    Redis.client.quit();
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

    var c = null;

    before(function (done) {
      var c_opts = {
        screen_name         : 'sn_1',
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
        old_screen_name : 'sn_1',
        screen_name     : 'sn_1_upDATED'
      };

      River.new()

      .job('update', 'screen name', function (j) {
        c.new_data = sn_opts;
        Screen_Name.update(c, j);
      })

      .run_and_on_finish(function (r) {
        assert.deepEqual(c.screen_names(), ['SN_1_UPDATED']);
        done();
      });

    }); // it

    it( 'updates homepage about', function (done) {
      var expected = 'This is about: mem1new';
      Screen_Name.update('mem1new', {new_data: {"about": expected}}, function (row) {
        assert.equal(row.about, expected);
        done();
      });
    });

    it.skip( 'updates homepage title', function (done) {
      var expected = 'This is for: ' + screen_name_2;
      customer.update_screen_name(screen_name_2, {"homepage_title": expected}, function (meta) {
        customer.read_homepage(screen_name_2,  function (data) {
          assert.equal(data.details.title, expected);
          done();
        });
      });
    });

    it.skip( 'updates homepage allow', function (done) {
      customer.read_screen_names(function (new_c) {
        var expected = _.pluck(new_c.data.screen_name_rows, 'id').sort();
        customer.update_screen_name(screen_name, {'homepage_allow': expected}, function (mets) {
          customer.read_homepage(screen_name, function (data) {
            assert.deepEqual(data.settings.allow.sort(), expected);
            done();
          });
        });
      });
    });
  }); // === describe update

  describe( 'trash', function () {

    it( 'it updates screen-name\'s trashed_at column', function (done) {
      var f = '%Y-%m-%dT%H:%M';
      customer.trash_screen_name(screen_name, function (meta) {
        customer.read_screen_names(function (new_c) {
          var r        = new_c.screen_name_row(screen_name);
          var actual   = r.trashed_at;
          var expected = (new Date());
          assert.equal( actual.getYear(), expected.getYear() );
          done();
        });
      });
    });

  }); // === describe trash

  describe( 'delete', function () {

    it( 'it deletes screen-name record', function (done) {
      customer.delete_screen_name(screen_name, function (meta) {
        customer.read_screen_names(function (new_c) {
          assert.deepEqual(new_c.screen_names(), [screen_name_2]);
          done();
        });
      });
    });

  }); // === describe delete

}); // === describe Screen_Name




