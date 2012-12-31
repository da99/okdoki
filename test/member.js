
var assert = require('assert');
var Member = require('okdoki/lib/Member').Member;

describe( 'Member.new', function () {

  it( 'checks min length of mask_name', function () {
    var mem = new Member();
    mem.new({ password: 'something for real'});
    assert.equal(mem.errors[0].indexOf("Name must be"), 0);
  });

  it( 'checks max length of mask_name', function () {
    var mem = new Member();
    mem.new({ mask_name: "0123456789012", password: 'something for real'});
    assert.equal(mem.errors[0].indexOf("Name must be"), 0);
  });

  it( 'allows a valid mask_name', function () {
    var mem = new Member();
    mem.new({ mask_name: "0123456", password: 'something for real'});
    assert.equal(mem.errors, 0);
  });

}); // === describe


describe( 'Member.new create', function () {

  it( 'saves member to db', function (done) {
    var mem = new Member();
    var mask_name = 'mem1';
    mem.new({mask_name: mask_name, password: 'something for security'});
    mem.create(function () {
      var read = new Member();
      read.read(mem.customer_id, function (rec, meta) {
        assert.equal(mem.customer_id, read.customer_id);
        done();
      });
    });
  });

  // it( 'saves member life to db', function () {
    // var mem = new Member();
    // var mask_name = 'mem1';
    // mem.new({mask_name: mask_name, password: 'something for security'});
    // mem.create();
    // var read = new Member();
    // read.read(mem.okid);
    // assert.equal([mask_name], read.screen_names);
  // });

}); // === describe



