
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

    it( 'returns true if valid', function () {
      var o = {new_data: {name: " name_1 "}};
      var result = Validate.new('test 1', function (v) {
        v.define('name', function (v) { });
      }).validate(o);
      assert.equal(result, true);
    });

    it( 'returns false if invalid', function () {
      var o = {new_data: {name: " name_1 "}};
      var result = Validate.new('test 1', function (v) {
        v.define('name', function (v) { v.at_least(100); });
      }).validate(o);
      assert.equal(result, false);
    });

    it.skip( 'calls River.invalid(msg)', function () {
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

  describe( '.at_least_2_words', function () {

    it( 'sets error if there is no space', function () {
      var o = {new_data: {name: "1234567890123"}};
      Validate.new('at_least_2_words', function (v) {
        v.define('name', function (v) { v.at_least_2_words(); });
      }).validate(o);
      assert.equal(o.errors, 'name must be two words or more.');
    });
  }); // === describe

  describe( '.equals', function () {

    it( 'sets error if value does not equal', function () {
      var o = {new_data: {name: "same"}};
      Validate.new('equals', function (v) {
        v.define('name', function (v) { v.equal('sa,e'); });
      }).validate(o);
      assert.equal(o.errors, 'name must equal: sa,e');
    });
  }); // === describe

  describe( '.not_empty', function () {
    it( 'sets error if value is null', function () {
      var o = {new_data: {name: null}};
      Validate.new('equals', function (v) {
        v.define('name', function (v) { v.not_empty(); });
      }).validate(o);
      assert.equal(o.errors, 'name must not be empty.');
    });

    it( 'sets error if value is undefined', function () {
      var o = {new_data: {}};
      Validate.new('equals', function (v) {
        v.define('name', function (v) { v.not_empty(); });
      }).validate(o);
      assert.equal(o.errors, 'name must not be empty.');
    });

    it( 'sets error if value is an empty string', function () {
      var o = {new_data: {name: ' '}};
      Validate.new('equals', function (v) {
        v.define('name', function (v) { v.not_empty(); });
      }).validate(o);
      assert.equal(o.errors, 'name must not be empty.');
    });

    it( 'sets error if value is an empty array', function () {
      var o = {new_data: {name: []}};
      Validate.new('equals', function (v) {
        v.define('name', function (v) { v.not_empty(); });
      }).validate(o);
      assert.equal(o.errors, 'name must not be empty.');
    });
  }); // === describe

}); // === describe
