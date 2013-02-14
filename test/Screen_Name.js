var _         = require('underscore')
, assert      = require('assert')
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Redis       = require('okdoki/lib/Redis').Redis
, River       = require('okdoki/lib/River').River
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
;

before(function (done) {
  Screen_Name(Redis.client);
  PG.new('delete all screen_names')
  .delete_all('screen_names')
  .run_and_on_finish(function (meta) {
    done();
  });
});

after(function (done) {
  Redis.client.quit();
  done();
});

describe( 'Screen_Name create:', function () {

  it( 'saves screen_name to datastore', function (done) {
    var c = {data: {id: 'C1'}, push_screen_name_row: function (r) { this.row = r;}};
    River.new()
    .job('create sn', 'mem1', function (j) {
      Screen_Name.create(c, j.id, j);
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

}); // === describe



describe.skip( 'Customer update_screen_name', function () {

  it( 'updates screen-name', function (done) {

    var mem = customer;
    var old = screen_name;
    var n   = 'new-' + old;
    mem.update_screen_name(old, n, function (meta) {
      mem.read_screen_names(function (c) {
        assert.deepEqual(c.data.screen_names.sort(), [n, screen_name_2].sort());
        screen_name = n;
        done();
      });
    });

  }); // it

  it( 'updates homepage about', function (done) {
    var expected = 'This is about: ' + screen_name_2;
    customer.update_screen_name(screen_name_2, {"homepage_about": expected}, function (meta) {
      customer.read_homepage(screen_name_2, function (data) {
        assert.equal(data.about, expected);
        done();
      });
    });
  });

  it( 'updates homepage title', function (done) {
    var expected = 'This is for: ' + screen_name_2;
    customer.update_screen_name(screen_name_2, {"homepage_title": expected}, function (meta) {
      customer.read_homepage(screen_name_2,  function (data) {
        assert.equal(data.details.title, expected);
        done();
      });
    });
  });

  it( 'updates homepage allow', function (done) {
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
}); // === describe


