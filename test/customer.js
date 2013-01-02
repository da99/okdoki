
var _              = require('underscore');
var assert         = require('assert');
var Customer       = require('okdoki/lib/Customer').Customer;
var pg             = require('okdoki/lib/POSTGRESQL');
var show_databases = pg.show_databases;
var customer_id    = null;

before(function (done) {

  var mask_name = 'mem1';
  var vals = ({mask_name: mask_name, password: 'something for security', ip: '000.00.000'});

  Customer.create(vals, function (mem) {
    customer_id = mem.customer_id;
    done();
  });

});


describe( 'Customer create', function () {

  it( 'checks min length of mask_name', function () {
    Customer.create({ password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf("Name must be"), 0);
    });
  });

  it( 'checks max length of mask_name', function () {
    Customer.create({ mask_name: "123456789012345678", password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf("Name must be"), 0);
    });
  });


  it( 'requires an ip address', function () {
    Customer.create({ mask_name: "0123456789012", password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[0].indexOf("IP address is required"), 0);
    });
  });

  it( 'allows a valid mask_name', function () {
    Customer.create({ mask_name: "0123456", password: 'something for real', ip: '000.000.000'}, null, function (mem) {
      assert.equal(mem.errors, 0);
    });
  });


  it( 'saves Customer, Customer screen-name, and creates a Customer db', function (done) {
    var mask_name = 'mem1';
    var read = Customer.read(customer_id, function (meta) {
      // Has the customer id been saved?
      assert.equal(customer_id, read.customer_id);

      // Has the screen name been saved?
      assert.deepEqual([mask_name], read.data.screen_names);

      // Has the Customer's db been created?
      show_databases(function (names) {
        assert.equal(_.last(names), 'customer-' + read.customer_id);
        done();
      });

    });
  });

}); // === describe

describe( 'Customer read', function () {

  it( 'reads customer from DB', function (done) {
    var mem = Customer.read(customer_id, function (meta) {
      assert(mem.customer_id, customer_id);
      done();
    });
  });

}); // === describe


describe( 'Customer update', function () {

  it( 'updates Customer email', function (done) {

    var new_email = 'new-email@i-hate-all.com';
    var mem = Customer.read(customer_id, function () {
      mem.update({'email': new_email}, function (meta) {
        var new_mem = new Customer(customer_id, function () {
          new_mem.read(customer_id, function (meta) {
            assert(new_mem.data.email, new_email);
            done();
          });
        });
      });
    });

  });

}); // === describe


