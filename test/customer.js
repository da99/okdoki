
var _              = require('underscore');
var assert         = require('assert');
var Customer       = require('okdoki/lib/Customer').Customer;
var pg             = require('okdoki/lib/POSTGRESQL');
var strftimeUTC    = require('strftime').strftimeUTC;
var strftime       = require('strftime').strftime;
var show_databases = pg.show_databases;
var customer_id    = null;
var customer       = null;
var screen_name    = 'mem1';
var screen_name_2  = 'go2';

before(function (done) {

  var screen_name = 'mem1';
  var vals = ({screen_name: screen_name, password: 'something for security', ip: '000.00.000'});

  Customer.create(vals, function (mem) {
    customer_id = mem.sanitized_data.id;
    Customer.read(customer_id, function (c) {
      c.read_screen_names( function (csn) {
        customer = csn;
        done();
      });
    });
  });

});


describe( 'Customer create', function () {

  it( 'checks min length of screen_name', function () {
    Customer.create({ password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf('Name, "", must be'), 0);
    });
  });

  it( 'checks max length of screen_name', function () {
    var screen_name = "123456789012345678";
    Customer.create({ screen_name: screen_name, password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[1].indexOf('Name, "' + screen_name + '", must be'), 0);
    });
  });

  it( 'requires an ip address', function () {
    Customer.create({ screen_name: "0123456789012", password: 'something for real'}, null, function (mem) {
      assert.equal(mem.errors[0].indexOf("IP address is required"), 0);
    });
  });

  it( 'allows a valid screen_name', function () {
    assert.deepEqual(customer.data.screen_names, [screen_name]);
  });


  it( 'saves Customer and Customer screen-name', function (done) {
    var c = customer;

    // Has the customer id been saved?
    assert.equal(customer_id, c.data.id);

    // Has the screen name been saved?
    assert.deepEqual([screen_name], c.data.screen_names);

    done();
  });

  it( 'adds a homepage entry', function (done) {
    var db = new pg.query();
    db.q('SELECT * FROM homepages;');
    db.run_and_then(function (meta) {
      assert.deepEqual(_.pluck(customer.data.screen_name_rows, 'id'), _.pluck(meta.rows, 'screen_name_id'));
      done();
    });
  }); // it

}); // === describe

describe( 'Customer create_screen_name', function () {

  it( 'adds entry to screen_names tables', function (done) {
    customer.create_screen_name(screen_name_2, function () {
      customer.read_screen_names(function (mem) {
        assert.deepEqual(mem.data.screen_names.sort(), [screen_name, screen_name_2].sort());
        customer = mem;
        done();
      });
    });
  }); // it

  it( 'adds a homepage entry to Customer db', function (done) {
    var db = new pg.query();
    db.q('SELECT * FROM homepages');
    db.run_and_then(function (meta) {
      assert.deepEqual(_.pluck(meta.rows, 'screen_name_id'), _.pluck(customer.data.screen_name_rows, 'id') );
      done();
    });
  }); // it

});

describe( 'Customer read', function () {

  it( 'reads Customer from DB', function (done) {
    Customer.read(customer_id, function (c, meta) {
      assert.equal(c.data.id, customer_id);
      done();
    });
  });

  it( 'reads screen-names', function (done) {
    assert.deepEqual(customer.data.screen_names.sort(), [screen_name, screen_name_2].sort());
    done();
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
    var mem = customer;
    mem.update({'email': new_email}, function (meta) {
      Customer.read(customer_id, function (new_mem) {
        new_mem.read(customer_id, function (meta) {
          assert(new_mem.data.email, new_email);
          done();
        });
      });
    });

  }); // it

  it( 'updates screen-name', function (done) {

    var mem = customer;
    var old = screen_name;
    var n   = 'new-' + old;
    mem.update({'old_screen_name': old, 'new_screen_name': n}, function (meta) {
      mem.read_screen_names(function (c) {
        assert.deepEqual(c.data.screen_names.sort(), [n, screen_name_2].sort());
        screen_name = n;
        done();
      });
    });

  }); // it

}); // === describe

describe( 'Customer trash', function () {

  it( 'it updates Customer trashed_at date.', function (done) {
    var f = '%Y-%m-%dT%H:%M';
    customer.trash(function () {
      Customer.read(customer_id, function (c) {
        assert.equal(c.data.trashed_at.toString(), (new Date()).toString());
        done();
      });
    });
  }); // it

}); // === describe

describe( 'Customer trash_screen_name', function () {

  it( 'it updates screen-name\'s trashed_at column', function (done) {
    var f = '%Y-%m-%dT%H:%M';
    customer.trash_screen_name(screen_name, function (meta) {
      customer.read_screen_names(function (new_c) {
        var r = new_c.screen_name_row(screen_name);
        assert.equal(r.trashed_at.toString(), (new Date()).toString() );
        done();
      });
    });
  });

}); // === describe

describe( 'Customer delete screen-name', function () {

  it( 'it deletes screen-name record', function (done) {
    customer.delete_screen_name(screen_name, function (meta) {
      customer.read_screen_names(function (new_c) {
        assert.deepEqual(new_c.data.screen_names, [screen_name_2]);
        done();
      });
    });
  });
}); // === describe

describe( 'Customer delete', function () {

  it( 'it deletes Customer record and all Customer screen-names', function (done) {
    var mem = customer;
    show_databases(function (old_list) {
      mem.delete(function () {
        // Customer record deleted.
        Customer.read(customer_id, function () {throw new Error('found');}, function () {

          // Screen names deleted.
          mem.read_screen_names(function () {throw new Error('found names');}, function () {
            done();
          });

        });
      });
    });
  }); // it

}); // === describe
