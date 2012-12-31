
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
