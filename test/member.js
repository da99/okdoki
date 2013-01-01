
var _ = require('underscore');
var assert = require('assert');
var Member = require('okdoki/lib/Member').Member;
var show_databases = require('okdoki/lib/DB').show_databases;

describe( 'Member.new', function () {

  it( 'checks min length of mask_name', function () {
    var mem = new Member();
    mem.new({ password: 'something for real'});
    assert.equal(mem.errors[0].indexOf("Name must be"), 0);
  });

  it( 'checks max length of mask_name', function () {
    var mem = new Member();
    mem.new({ mask_name: "123456789012345678", password: 'something for real'});
    assert.equal(mem.errors[0].indexOf("Name must be"), 0);
  });


  it( 'requires an ip address', function () {
    var mem = new Member();
    mem.new({ mask_name: "0123456789012", password: 'something for real'});
    assert.equal(mem.errors[0].indexOf("IP address is required"), 0);
  });

  it( 'allows a valid mask_name', function () {
    var mem = new Member();
    mem.new({ mask_name: "0123456", password: 'something for real', ip: '000.000.000'});
    assert.equal(mem.errors, 0);
  });

}); // === describe


describe( 'Member.new create', function () {

  it( 'saves member to db', function (done) {
    var mem = new Member();
    var mask_name = 'mem1';
    mem.new({mask_name: mask_name, password: 'something for security', ip: '000.00.000'});
    mem.create(function () {
      var read = new Member();
      read.read(mem.customer_id, function (rec, meta) {
        assert.equal(mem.customer_id, read.customer_id);
        done();
      });
    });
  });

  it( 'saves member life to db', function (done) {
    var mem = new Member();
    var mask_name = 'mem2';
    mem.new({mask_name: mask_name, password: 'something for security', ip: '000.00.00'});
    mem.create(function () {
      var read = new Member();
      read.read(mem.customer_id, function () {
        assert.deepEqual([mask_name], read.screen_names);
        done();
      });
    });
  });

  it( 'creates a database just for the new Customer', function (done) {
    var mem = new Member();
    var mask_name = 'mem3';
    mem.new({mask_name: mask_name, password: 'something for security', ip: '000.00.00'});
    mem.create(function () {
      show_databases(function (meta) {
        assert.equal(_.last(_.pluck(meta.rows, 'name')), 'customer-' + mem.customer_id);
        done();
      });
    });
  });

}); // === describe



