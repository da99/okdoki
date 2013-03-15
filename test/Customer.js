
var _              = require('underscore');
var assert         = require('assert');
var River          = require('da_river').River;
var Customer       = require('okdoki/lib/Customer').Customer;
var Screen_Name    = require('okdoki/lib/Screen_Name').Screen_Name;
var Topogo         = require('topogo').Topogo;
var strftimeUTC    = require('strftime').strftimeUTC;
var strftime       = require('strftime').strftime;

var customer_id    = null;
var customer       = null;
var screen_name    = 'mem1';
var pass_phrase    = "this is my password";
var screen_name_2  = 'go2';
var screen_name_id = null;
var h = require('okdoki/test/helpers');

describe( 'Customer', function () {

  before(function (done) {

    var screen_name = 'mem1';
    var pwp         = pass_phrase;
    var vals = {screen_name: screen_name, pass_phrase: pwp, confirm_pass_phrase: pwp, ip: '000.00.000'};

    River.new(null)
    .job('clear data', [Customer, 'delete_all'])
    .job('create:', screen_name, [Customer, 'create', vals])
    .job('read:', screen_name, function (j) {
      customer_id = j.river.last_reply().sanitized_data.id;
      Customer.read_by_id(customer_id, j);
    })
    .run(function (r) {
      customer       = r.last_reply();
      screen_name_id = customer.screen_name_id(screen_name);
      done();
    });

  }); // === end before

  describe( 'create:', function () {

    it( 'checks min length of screen_name', function (done) {
      var opts = { pass_phrase: pass_phrase, confirm_pass_phrase: pass_phrase, ip: '000.00.00'};
      River.new(null)
      .next('invalid', function (msg) {
        assert.equal(msg.indexOf('Screen name must be: '), 0);
        done();
      })
      .job('create', 'w missing name', [Customer, 'create', opts])
      .run(function (r) {
        throw new Error('Unreachable.');
      });
    });

    it( 'checks max length of screen_name', function (done) {
      var screen_name = "12345678901234567890";
      var opts = {
        screen_name: screen_name,
        pass_phrase: pass_phrase,
        confirm_pass_phrase: pass_phrase,
        ip: '00.000.000'
      };

      River.new(null)
      .next('invalid', function (msg) {
        assert.equal(msg.indexOf('Screen name must be: '), 0);
        done();
      })
      .job(function (j) { Customer.create(opts, j); })
      .run(h.throw_it);
    });

    it( 'saves screen_name to Customer object', function () {
      assert.deepEqual(customer.screen_names(), [screen_name.toUpperCase()]);
    });

    it( 'saves Customer id to Customer ovject', function (done) {
      var c = customer;

      // Has the customer id been saved?
      assert.equal(customer_id, c.data.id);

      // Has the screen name been saved?
      assert.deepEqual([screen_name.toUpperCase()], c.screen_names());

      done();
    });

  }); // === describe create


  describe( 'read_by_id:', function () {

    it( 'reads Customer from DB using customer id', function (done) {
      River.new(null)
      .job('read', customer_id, [Customer, 'read_by_id', customer_id])
      .run(function (r) {
        var c = r.last_reply();
        assert.equal(c.data.id, customer_id);
        done();
      });
    });

    it( 'reads screen-names', function (done) {
      River.new(null)
      .job('read', customer_id, [Customer, 'read_by_id', customer_id])
      .run(function (r) {
        var c = r.last_reply();
        assert.deepEqual(c.screen_names(), [screen_name.toUpperCase()]);
        done();
      });
    });

    it( 'executes not found func', function (done) {
      River.new(null)
      .next('not found', function (msg) {
        assert.equal(msg, 'Customer, no-id, not found.');
        done();
      })
      .job('read empty:', 'no-id', [Customer, 'read_by_id', 'no-id'])
      .run(h.throw_it);
    });

  }); // === describe read_by_id

  describe( 'read_by_screen_name', function () {

    it( 'reads customer if passed screen-name as string', function (done) {
      River.new('read by screen name')
      .job('read:', screen_name, [Customer, 'read_by_screen_name', screen_name])
      .run(function (r) {
        var c = r.last_reply();
        assert.equal(customer_id, c.data.id);
        done();
      });
    });

    it( 'reads customer if passed a hash with: screen_name', function (done) {
      River.new('read by screen name')
      .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name}])
      .run(function (r) {
        var c = r.last_reply();
        assert.equal(customer_id, c.data.id);
        done();
      });
    });

    it( 'reads customer if passed a hash with: screen_name, correct pass_phrase', function (done) {
      River.new('read by screen name', null)
      .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: pass_phrase}])
      .run(function (r) {
        var c = r.last_reply();
        assert.equal(customer_id, c.data.id);
        done();
      });
    });

    it( 'does not read customer if passed a hash with: screen_name, incorrect pass_phrase', function (done) {
      River.new('read by screen name', null)
      .next('not found', function (msg) {
        assert.equal(msg, 'Customer, ' + screen_name + ', not found.');
        done();
      })
      .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: 'no pass phrase'}])
      .run(function(){ throw new Error('this is not supposed to be reached.');});
    });

  }); // === describe read_by_screen_name


  describe( 'update:', function () {

    it('updates Customer email', function (done) {
      var new_email = 'new-e\'mail@i-hate-all.com';
      River.new(null)
      .next('invalid', h.throw_it)
      .job('update customer', new_email, [customer, 'update', {'email': new_email}])
      .job('assert new email', function (j) {
        assert.equal(customer.data.email, new_email);
        j.finish(customer.data.email);
      })
      .job('read customer', customer_id, [Customer, 'read_by_id', customer_id])
      .run(function (r) {
        assert.equal(r.last_reply().data.email, new_email);
        done();
      });
    }); // it

  }); // === describe update

  describe( 'trash', function () {

    it( 'it updates Customer trashed_at date.', function (done) {
      var f = '%Y-%m-%dT%H:%M';
      River.new('trash customer', null)
      .job('trash customer', customer_id, [customer, 'trash'])
      .job('assert trashed_at changed', function (j) {
        assert.equal(h.is_recent(customer.data.trashed_at), true);
        j.finish(customer);
      })
      .job('read customer', customer_id, [Customer, 'read_by_id', customer_id])
      .run(function (r) {
        var c = r.last_reply();
        assert.equal(h.is_recent(c.data.trashed_at), true);
        done();
      });
    }); // it

  }); // === describe trash

  describe( 'delete_trashed', function () {

    it( 'it does not delete Customer records less than 2 days old', function (done) {
      var trashed_at = h.ago('-1d -22h');

      River.new(null)
      .job('update trashed_at', function (j) {
        Topogo.new(Customer.TABLE_NAME)
        .update(customer_id, { trashed_at: trashed_at }, j)
      })
      .job('delete customers', [Customer, 'delete_trashed'])
      .job('read customer', [Customer, 'read_by_id', customer_id])
      .run(function (r) {
        var age = h.utc_diff(r.last_reply().data.trashed_at);
        var almost_2_days = h.utc_diff(h.ago('-1d -22h'));
        assert.equal( (age - almost_2_days) < 1000, true);
        done();
      });
    }); // it

    it( 'it deletes Customer and Screen-Names records more than 2 days old', function (done) {

      River.new(null)

      .job('update trashed_at', function (j) {
        Topogo.new(Customer.TABLE_NAME)
        .update(customer_id, {trashed_at: h.ago('-3d')}, j)
      })

      .job('delete customers', [Customer, 'delete_trashed'])

      .next('not found', function (msg, r) {

        assert.equal(msg, "Customer, " + customer_id + ', not found.');

        River.new(null)
        .job('read screen names', function (j) {
          Topogo.new(Screen_Name.TABLE_NAME)
          .read_list_by_example({owner_id: customer_id}, j);
        })
        .reply(function (rows) {
          assert.equal(rows.length, 0);
          done();
        })
        .run();
      })

      .job('read customer', [Customer, 'read_by_id', customer_id])

      .run(function () {
        throw new Error('Should not be reached.');
      });
    }); // it

  }); // === describe delete


}); // === describe Customer





