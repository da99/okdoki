
require './tests/helpers'
require './Server/Customer/model'


describe 'read_by_id:' do

  it 'reads Customer from DB using customer id' do
    c = Customer.read_by_id(id)
    c.data[:id].should.equal == customer_id
  end

  it 'reads screen-names' do
    c = Customer.read_by_id(id)
    c.screen_names.names.should.equal [screen_name.upcase]
  end

  it 'executes not found func' do
    lambda {
      Customer.read_by_id(0)
    }.should.raise(Customer::Not_Found).
    message.
    should.match /Customer not found/
  end

end # === describe read_by_id ===


describe( 'read_by_screen_name', function () {

  it( 'reads customer if passed screen-name as string', function (done) {
  River.new('read by screen name')
  .job('read:', screen_name, [Customer, 'read_by_screen_name', screen_name])
  .run(function (r, last) {
    var c = last;
    assert.equal(customer_id, c.data.id);
    done();
  });
});

it( 'reads customer if passed a hash with: screen_name', function (done) {
  River.new('read by screen name')
  .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name}])
  .run(function (r, last) {
    var c = last;
    assert.equal(customer_id, c.data.id);
    done();
  });
});

it( 'reads customer if passed a hash with: screen_name, correct pass_phrase', function (done) {
  River.new('read by screen name', null)
  .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: pass_phrase}])
  .run(function (r, last) {
    var c = last;
    assert.equal(customer_id, c.data.id);
    done();
  });
});

it( 'does not read customer if passed a hash with: screen_name, incorrect pass_phrase', function (done) {
  River.new('read by screen name', null)
  .on_next('invalid', function (j, err) {
    assert.equal(err.message, 'Pass phrase is incorrect. Check your CAPS LOCK key.');
    done();
  })
  .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: 'no pass phrase'}])
  .run(function(){ throw new Error('this is not supposed to be reached.');});
});

it( 'increases bad_log_in_count by one if incorrect pass_phrase supplied', function (done) {
  River.new()
  .job('ensure bad_log_in_count', function (j) {
    Topogo.new(Customer.TABLE_NAME).update_where_set(customer.data.id, {bad_log_in_count: 3}, j);
  })
  .on_next('invalid', function (j, err) {
    River.new()
    .job('read customer', function (j) {
      Topogo.new(Customer.TABLE_NAME).read_one(customer.data.id, j);
    })
    .job('assert bad log_in_count', function (j, c) {
      assert.equal(4, c.bad_log_in_count);
      j.finish();
    })
    .run(function () {
      done();
    });
  })
  .job('simulate real-world read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: 'no pass phrase'}])
  .run(function(){ throw new Error('this is not supposed to be reached.');});
});

it( 'updates log_in_at to PG current_date when logging in', function (done) {
  var d = null;
  River.new()
  .job('select current_date', function (j) {
    Topogo.new(Customer.TABLE_NAME)
    .run("SELECT current_date AS date", {}, j);
  })
  .job('ensure old date for log_in_at', function (j, rows) {
    d = rows[0].date;
    Topogo.new(Customer.TABLE_NAME)
    .run("UPDATE @table SET log_in_at = '1999-01-01';", {}, j);
  })
  .job('read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: pass_phrase}])
  .run(function (fin, last) {
    assert.equal(d.toUTCString(), last.data.log_in_at.toUTCString());
    done();
  });
});

it( 'returns invalid if: correct pass phrase, too many bad log-ins', function (done) {
  River.new()
  .job('reset log in col vals', function (j) {
    Topogo.new(Customer.TABLE_NAME).update_where_set(customer.data.id, {log_in_at: '$now', bad_log_in_count: 4}, j);
  })
  .on_next('invalid', function (j, err) {
    assert.equal("Too many bad log-ins for today. Try again tomorrow.", err.message);
    done();
  })
  .job('simulate real-world read:', screen_name, [Customer, 'read_by_screen_name', {screen_name: screen_name, pass_phrase: pass_phrase}])
  .run(function(){ throw new Error('this is not supposed to be reached.');});
});
}); // === describe read_by_screen_name

