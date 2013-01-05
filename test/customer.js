
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

  it( 'allows a valid screen_name', function () {
    assert.deepEqual(customer.data.screen_names, [screen_name]);
  });


  it( 'saves Customer, Customer screen-name, and creates a Customer db', function (done) {
    var c = customer;

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

  it( 'creates a homepages table in Customer DB', function (done) {
    var sql = "SELECT table_schema || '.' || table_name AS table_name\
         FROM    information_schema.tables         \
         WHERE   table_type = 'BASE TABLE'         \
         AND     table_schema NOT IN ('pg_catalog', 'information_schema');";
    var db = new pg.query('/' + customer.data.db_name);
    // FROM: http://stackoverflow.com/questions/769683/show-tables-in-postgresql
    db.q(sql);
    db.run_and_then(function (meta) {
      assert.deepEqual([{'table_name':'public.homepages'}], meta.rows);
      done();
    });
  });

  it( 'adds a homepage entry to Customer db', function (done) {
    var db = new pg.query('/' + customer.data.db_name);
    db.q('SELECT * FROM homepages');
    db.run_and_then(function (meta) {
      assert.deepEqual( _.pluck(customer.data.screen_name_rows, 'id'), _.pluck(meta.rows, 'screen_name_id'));
      done();
    });
  }); // it

}); // === describe

describe( 'Customer read', function () {

  it( 'reads Customer from DB', function (done) {
    Customer.read(customer_id, function (c, meta) {
      assert.equal(c.data.id, customer_id);
      done();
    });
  });

  it( 'reads screen-names', function (done) {
    assert.deepEqual(customer.data.screen_names, [screen_name]);
    done();
  });

  it( 'executes on_err func', function (done) {
    Customer.read("no one", function () { throw new Error('err'); },  function (meta) {
      assert.equal(meta.rowCount, 0);
      done();
    });
  });

}); // === describe


describe( 'Customer create_screen_name', function () {

  it( 'adds entry to screen_names tables'); // it

  // it( 'adds a homepage entry to Customer db', function (done) {
    // var db = new pg.query('/' + customer.data.db_name);
    // db.q('SELECT * FROM homepages');
    // db.run_and_then(function (meta) {
      // assert.deepEqual( _.pluck(customer.data.screen_name_rows, 'id'), _.pluck(meta.rows, 'screen_name_id'));
    // });
  // }); // it

});

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
    var old = mem.data.screen_names[0];
    var n   = 'new-' + old;
    mem.update({'old_screen_name': old, 'new_screen_name': n}, function (meta) {
      mem.read_screen_names(function (c) {
        assert.equal(c.data.screen_names[0], n);
        done();
      });
    });

  }); // it

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
    var mem = customer;
    show_databases(function (old_list) {
      mem.delete(function () {
        show_databases(function (new_list) {
          old_list.pop();
          // Customer db deleted.
          assert.deepEqual(old_list, new_list);

          // Customer record deleted.
          Customer.read(customer_id, function () {throw new Error('found');}, function () {

            // Screen names deleted.
            mem.read_screen_names(function () {throw new Error('found names');}, function () {
              done();
            });

          });
        });
      });
    });
  }); // it

}); // === describe


