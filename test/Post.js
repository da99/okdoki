var _      = require('underscore')
, assert   = require('assert')
, Customer = require('okdoki/lib/Customer').Customer
, Post     = require('okdoki/lib/Post').Post
, Follow   = require('okdoki/lib/Follow').Follow
, River    = require('da_river').River
, Topogo   = require('topogo').Topogo
;


describe( 'Post', function () {

  var customer, customer_id, screen_name_id, pwp;
  var follows = Topogo.new('follows');
  var posts   = Topogo.new('posts');

  before(function (done) {

    // Reset sample data.
    pwp             = 'This is my pass_phrase';
    var screen_name = 'mem1';
    var vals = ({screen_name: screen_name, pass_phrase: pwp, confirm_pass_phrase: pwp, ip: '000.00.000'});

    River.new(null)
    .job('clear customers', [Customer, 'delete_all'])
    .job('clear follows', [follows, 'delete_all'])
    .job('clear posts', [posts, 'delete_all'])
    .job('create:', vals.screen_name, [Customer, 'create', vals])
    .job('record id', function (j, last) {
      customer_id = last.sanitized_data.id;
      j.finish(customer_id);
    })
    .job('read', vals.screen_name, function (j) {
      Customer.read_by_id(customer_id, j);
    })
    .job('save values', function (j, last) {
      customer = last;
      screen_name_id = _.first(_.values(customer.data.screen_name_rows)).id;
      j.finish();
    })
    .run(function () {
      done();
    });
  });

  describe( 'feed', function () {

    it( 'grabs feed of items meant for the world', function (done) {
      River.new(null)
      .job([Follow, 'create',  screen_name_id, 'mag1'])
      .job([Post, 'create_by', screen_name_id, {pub_id: 'mag1', section: 'random', body: 'post 1' }])
      .job([Post, 'create_by', screen_name_id, {pub_id: 'mag1', section: 'emergency', body: 'post 5'}])
      .job([Post, 'create_by', screen_name_id, {pub_id: 'mag1', section: 'status', body: 'post 2'}])
      .job([Post, 'read_feed'])
      .run(function (river, raw_rows) {
        var rows = _.map(raw_rows, function (r, i) { return r.id;});
        assert.deepEqual(rows, ['p2']);
        done();
      });
    });

    it( 'grabs feed of items meant for any of the screen names.', function (done) {
      var db = new pg.query();
      db.q('INSERT INTO posts (id, pub_id, section_id, allow, body) VALUES ( $1, $2, $3, $4, $5 );', ['p3', 'mag1', '3', '{"' + screen_name_id + '"}', 'post 3' ]);
      db.q('INSERT INTO posts (id, pub_id, section_id, allow, body) VALUES ( $1, $2, $3, $4, $5 );', ['p4', 'mag1', '4', '{"' + screen_name_id + '"}', 'post 4' ]);
      db.run_and_then(function (meta) {
        customer.read_feed(function (raw_rows) {
          var rows = _.map(raw_rows, function (r, i) { return r.id;});
          assert.deepEqual(rows, ['p2', 'p3', 'p4'].reverse());
          done();
        });
      });
    });

    it( 'does not grab items for any screen name in disallow.', function (done) {
      var db = new pg.query();
      db.q('INSERT INTO posts (id, pub_id, section_id, allow, disallow, body) VALUES ( $1, $2, $3, $4, $5, $6 );', ['p6', 'mag1', '4', '{"@","' + screen_name_id + '"}', '{"' + screen_name_id + '"}', 'post 6' ]);
      db.run_and_then(function (meta) {
        customer.read_feed(function (raw_rows) {
          var rows = _.map(raw_rows, function (r, i) { return r.id;});
          assert.deepEqual(rows, ['p2', 'p3', 'p4'].reverse());
          done();
        });
      });
    });

    it( 'grabs feed items for customer if in allowed contact label', function (done) {
      var db = new pg.query();
      db.q('INSERT INTO labelings (id, pub_id, label_id) VALUES ( $1, $2, $3 );',       ['lg1', screen_name_id, 'l1'] );
      db.q('INSERT INTO posts (id, pub_id, section_id, allow, body) VALUES ( $1, $2, $3, $4, $5 );', ['p7', 'mag1', '4', '{"@","l1"}', 'post 7' ]);
      db.run_and_then(function (meta) {
        customer.read_feed(function (raw_rows) {
          var rows = _.map(raw_rows, function (r, i) { return r.id;});
          assert.deepEqual(rows, ['p2', 'p3', 'p4', 'p7'].reverse());
          done();
        });
      });
    });

    it( 'does not grab items for any screen name in disallowed labels.', function (done) {
      var db = new pg.query();
      db.q('INSERT INTO posts (id, pub_id, section_id, allow, disallow, body) VALUES ( $1, $2, $3, $4, $5, $6 );', ['p8', 'mag1', '4', '{"@"}', '{"l1"}', 'post 8' ]);
      db.run_and_then(function (meta) {
        customer.read_feed(function (raw_rows) {
          var rows = _.map(raw_rows, function (r, i) { return r.id;});
          assert.deepEqual(rows, ['p2', 'p3', 'p4', 'p7'].reverse());
          done();
        });
      });
    });

  }); // === describe

}); // === end desc

