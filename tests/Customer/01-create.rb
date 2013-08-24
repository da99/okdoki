
require './tests/helpers'
require './Server/Customer/model'

describe( 'create:', function () {

  it( 'checks min length of screen_name', function (done) {
  var opts = { pass_phrase: pass_phrase, confirm_pass_phrase: pass_phrase, ip: '000.00.00'};

  River.new(null)
  .on_next('invalid', function (j) {
    assert.equal(j.job.error.message.indexOf('Screen name must be: '), 0);
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
  .on_next('invalid', function (j) {
    assert.equal(j.job.error.message.indexOf('Screen name must be: '), 0);
    done();
  })
  .job(function (j) { Customer.create(opts, j); })
  .run(h.throw_it);
});

it( 'checks pass_phrase and confirm_pass_phrase match', function (done) {
  var screen_name = "123456789";
  var opts = {
    screen_name: screen_name,
    pass_phrase: pass_phrase,
    confirm_pass_phrase: pass_phrase + "a",
    ip: '00.000.000'
  };

  River.new(null)
  .on_next('invalid', function (j) {
    assert.equal(j.job.error.message, "Pass phrase is different than pass phrase confirmation.");
    done();
  })
  .job(function (j) { Customer.create(opts, j); })
  .run(h.throw_it);
});

it( 'saves screen_name to Customer object', function () {
  assert.deepEqual(customer.screen_names(), [screen_name.toUpperCase()]);
});

it( 'saves Customer id to Customer object', function () {
  var c = customer;

  // Has the customer id been saved?
  assert.equal(customer_id, c.data.id);

  // Has the screen name been saved?
  assert.deepEqual([screen_name.toUpperCase()], c.screen_names());
});

it( 'sets log_in_at to current date', function (done) {
  var c = customer;
  var n = new Date();
  var date = (new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 0, 0, 0)).toUTCString();


  River.new()
  .job('get current date', function (j) {
    Topogo.new('any table')
    .run_and_return_at_most_1("SELECT current_date as date; ", {}, j);
  })
  .run(function (fin, r) {
    assert.equal(r.date.toUTCString(), c.data.log_in_at.toUTCString());
    done();
  });
});

}); // === describe create


