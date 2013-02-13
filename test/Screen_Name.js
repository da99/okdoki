var _         = require('underscore')
, assert      = require('assert')
, RSN         = require('okdoki/lib/Screen_Name').Screen_Name
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Redis       = require('okdoki/lib/Redis').Redis
, River       = require('okdoki/lib/River').River
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
;

before(function (done) {
  RSN(Redis.client);
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

describe( 'Screen_Name create', function () {

  it( 'saves screen_name to datastore', function (done) {
    var c = {data: {id: 'C1'}, push_screen_name_row: function (r) { this.row = r;}};
    var r = River.new();
    r

    .job('create sn', 'mem1', function (j) {
      Screen_Name.create(c, j.id, r);
    })

    .job('read sn', 'mem1', function (j) {

      PG.run(j, SQL
        .select('*')
        .from('screen_names')
        .where('screen_name = UPPER( $1 )', [j.id])
        .limit(1)
      );

    })

    .run_and_on_finish(function () {
      var sn = r.last_reply();
      assert.equal(sn.screen_name, 'mem1'.toUpperCase());
      done();
    });
  }); // it


});

describe.skip( 'Screen_Name', function () {

  describe( 'create_im', function () {
    it( 'saves im', function (done) {
      var body = 'Yo yo.';
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: body}, function (r, m) {
        Redis.client.hget(m.id, 'body', function (e, r) {
          assert.equal(r, body);
          done();
        });
      });
    });

    it( 'sets an expire time', function (done) {
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: "something"}, function (r, m) {
        Redis.client.ttl(m.id, function (e, r) {
          assert.equal(r > RSN.expire_in && r <= 10, true);
          done();
        });
      });
    });

    it( 'update expire time of msgs group', function (done) {
      var rsn  = RSN.new('u1');
      rsn.create_im({owner: 'u1', body: "something"}, function (r, m) {
        Redis.client.ttl('u1:msgs', function (e, r) {
          assert.equal(r > RSN.expire_in && r <= 10, true);
          done();
        });
      });
    });
  }); // === describe

  describe( 'read_ims', function () {
    it( 'retrieves ims', function (done) {
      var multi = Redis.client.multi();
      var body = ['Yo yo: 1', 'Yo yo:2 '];
      var rsn  = RSN.new('u2');

      multi.hmset('f1:msgs', {'f1:1': 1});
      multi.hmset('f1:msgs', {'f1:2': 1});
      multi.hmset('f1:1', {'body': body[0]});
      multi.hmset('f1:2', {'body': body[1]});
      multi.hmset('u2:c', {'f1':1});
      multi.exec(function (err, replys) {
        rsn.read_ims(function (r) {
          assert.deepEqual(_.pluck(r, 'body'), body);
          done();
        });
      });

    });
  }); // === describe

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


