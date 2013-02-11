
var _ = require('underscore')
, assert = require('assert')
, Validate = require('okdoki/lib/Validate').Validate
;


describe( 'Validate', function () {

  describe( '.validate', function () {

    it( 'trims values by default', function () {
      var o = {new_data: {name: " name_1 "}};
      Validate.new('test 1', function (v) {
        v.define('name', function (v) { });
      }).validate(o);
      assert.deepEqual(o.sanitized_data, {name: "name_1"});
    });

    it.skip( 'calls River.invalid(msg)', function (done) {
    });

  }); // === describe

  describe( '.at_least', function () {

    it( 'sets error msg if less than min', function () {
      var o = {new_data: {name: "123"}};
      Validate.new('at_least', function (v) {
        v.define('name', function (v) { v.at_least(5); });
      }).validate(o);
      assert.equal(o.errors, 'name must be at least: 5');
    });
  }); // === describe

  describe( '.between', function () {
    it( 'sets error msg if: length < min', function () {
      var o = {new_data: {name: "123"}};
      Validate.new('between', function (v) {
        v.define('name', function (v) { v.between(5,10); });
      }).validate(o);
      assert.equal(o.errors, 'name must be between: 5 and 10');
    });

    it( 'sets error msg if: length > max', function () {
      var o = {new_data: {name: "1234567890123"}};
      Validate.new('between', function (v) {
        v.define('name', function (v) { v.between(5,10); });
      }).validate(o);
      assert.equal(o.errors, 'name must be between: 5 and 10');
    });
  }); // === describe
}); // === describe
