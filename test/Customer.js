
var _              = require('underscore');
var assert         = require('assert');
var River          = require('okdoki/lib/River').River;
var Customer       = require('okdoki/lib/Customer').Customer;
var pg             = require('okdoki/lib/POSTGRESQL');
var strftimeUTC    = require('strftime').strftimeUTC;
var strftime       = require('strftime').strftime;
var show_databases = pg.show_databases;
var customer_id    = null;
var customer       = null;
var screen_name    = 'mem1';
var pass_phrase     = "this is my password";
var screen_name_2  = 'go2';
var screen_name_id = null;

function throw_it() {
  console.log.apply(console, arguments);
  throw new Error(arguments[0].toString());
  return false;
}

before(function (done) {

  var screen_name = 'mem1';
  var pwp         = pass_phrase;
  var vals = {screen_name: screen_name, pass_phrase: pwp, confirm_pass_phrase: pwp, ip: '000.00.000'};

  River.new()
  .on_job('invalid', throw_it)
  .job('create:', screen_name, [Customer, 'create', vals])
  .job('read:', screen_name, function (j) {
    customer_id = j.river.last_reply().sanitized_data.id;
    Customer.read(customer_id, j);
  })
  .run_and_on_finish(function () {
    customer = r.last_reply();
    screen_name_id = customer.screen_name_id(screen_name);
    done();
  })
  ;

});

describe( 'Customer create', function () {

  it( 'checks min length of screen_name', function () {
    var opts = { pass_phrase: pass_phrase, confirm_pass_phrase: pass_phrase, ip: '000.00.00'};
    River.new()
    .job('create', 'w missing name', [Customer, opts])
    .run_and_on_finish(function (r) {
      assert.equal(r.last_reply().errors[0].indexOf('Name, "", must be'), 0);
    });
  });

  it( 'checks max length of screen_name', function () {
    var screen_name = "123456789012345678";
    var opts = { screen_name: screen_name, pass_phrase: pass_phrase, confirm_pass_phrase: pass_phrase, ip: '00.000.000' };
    Customer.create( opts, null, function (mem) {
      assert.equal(mem.errors[0].indexOf('Name, "' + screen_name + '", must be'), 0);
    });
  });

  it( 'requires an ip address', function () {
    var opts = { screen_name: "0123456789012", pass_phrase: pass_phrase, confirm_pass_phrase: pass_phrase };
    Customer.create( opts, null, function (mem) {
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

}); // === describe

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

  it( 'reads customer if passed a hash with: screen_name, pass_phrase', function (done) {
    Customer.read({screen_name: screen_name, pass_phrase: pass_phrase},
                 function (c) {
                   assert.equal(customer_id, c.data.id);
                   done();
                 }, function () {
                   throw new Error('Customer not found.');
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
        var r        = new_c.screen_name_row(screen_name);
        var actual   = r.trashed_at;
        var expected = (new Date());
        assert.equal( actual.getYear(), expected.getYear() );
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




