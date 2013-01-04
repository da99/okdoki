
var _              = require('underscore');
var assert         = require('assert');
var Customer       = require('okdoki/lib/Customer').Customer;
var Screen_names   = require('okdoki/lib/Screen_names').Screen_names;
var pg             = require('okdoki/lib/POSTGRESQL');
var strftimeUTC    = require('strftime').strftimeUTC;
var strftime       = require('strftime').strftime;
var show_databases = pg.show_databases;
var customer_id    = null;
var screen_name    = 'mem1';

before(function (done) {

  var screen_name = 'mem1';
  var vals = ({screen_name: screen_name, password: 'something for security', ip: '000.00.000'});

  Customer.create(vals, function (mem) {
    customer_id = mem.sanitized_data.id;
    done();
  });

});


describe( 'Customer create', function () {

  it( 'checks min length of screen_name', function () {
    Customer.create({ password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf("Name must be"), 0);
    });
  });

  it( 'checks max length of screen_name', function () {
    Customer.create({ screen_name: "123456789012345678", password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf("Name must be"), 0);
    });
  });

  it( 'requires an ip address', function () {
    Customer.create({ screen_name: "0123456789012", password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[0].indexOf("IP address is required"), 0);
    });
  });

  it( 'allows a valid screen_name', function (done) {
    Customer.read(customer_id, function (c, meta) {
      assert.deepEqual(c.data.screen_names, [screen_name]);
      done();
    });
  });


  it( 'saves Customer, Customer screen-name, and creates a Customer db', function (done) {
    Customer.read(customer_id, function (c, meta) {
      // Has the customer id been saved?
      assert.equal(customer_id, c.data.id);

      // Has the screen name been saved?
      assert.deepEqual([screen_name], c.data.screen_names);

      // Has the Customer's db been created?
      show_databases(function (names) {
        assert.equal(_.last(names), 'customer-' + c.data.id);
        done();
      });

    });
  });

}); // === describe

describe( 'Customer read', function () {

  it( 'reads Customer from DB', function (done) {
    Customer.read(customer_id, function (c, meta) {
      assert.equal(c.data.id, customer_id);
      done();
    });
  });

  it( 'reads screen-names', function (done) {
    Customer.read(customer_id, function (c, meta) {
      assert.deepEqual(c.data.screen_names, [screen_name]);
      done();
    });
  });

  it( 'executes on_err func', function (done) {
    Customer.read("no one", function () { throw new Error('err'); },  function (meta) {
      assert.equal(meta.rowCount, 0);
      done();
    });
  });

}); // === describe


describe( 'Customer update', function () {

  it( 'updates Customer email', function (done) {

    var new_email = 'new-e\'mail@i-hate-all.com';
    Customer.read(customer_id, function (mem) {
      mem.update({'email': new_email}, function (meta) {
         Customer.read(customer_id, function (new_mem) {
          new_mem.read(customer_id, function (meta) {
            assert(new_mem.data.email, new_email);
            done();
          });
        });
      });
    });

  }); // it

  it( 'updates screen-name', function (done) {
    Customer.read(customer_id, function (mem) {
      var old = mem.data.screen_names[0];
      var n   = 'new-' + old;
      mem.update({'old_screen_name': old, 'new_screen_name': n}, function (meta) {
        Customer.read(customer_id, function (c) {
          assert.equal(c.data.screen_names[0], n);
          done();
        });
      });
    });

  });

}); // === describe

describe( 'Customer trash', function () {

  it( 'it updates Customer trashed_at date.', function (done) {
    var f = '%Y-%m-%dT%H:%M';
    Customer.read(customer_id, function (mem) {
      mem.trash(function () {
        Customer.read(customer_id, function (c) {
          assert.equal(strftimeUTC(f, c.data.trashed_at), strftimeUTC(f, new Date()));
          done();
        });
      });
    });
  }); // it

}); // === describe

describe( 'Customer delete', function () {

  it( 'it deletes Customer record, Customer db, and all Customer screen-names', function (done) {
    show_databases(function (old_list) {
      Customer.read(customer_id, function (mem) {
        mem.delete(function () {
          show_databases(function (new_list) {
            old_list.pop();
            // Customer db deleted.
            assert.deepEqual(old_list, new_list);

            // Customer record deleted.
            Customer.read(customer_id, function () {throw new Error('found');}, function () {

              // Screen names deleted.
              Screen_names.read(mem, function () {throw new Error('found names');}, function () {
                done();
              });

            });
          });
        });
      });
    });
  }); // it

}); // === describe


