
var _ = require('underscore')._
, Ok  = require('../Server/Ok/model')
, assert = require('assert')
;


describe( 'Ok.Model', function () {

  // =========================================================
  describe( '.new', function () {

    _.each([null, undefined, 0], function (val) {
      it( 'returns null if a ' + val + ' value passed to it', function () {
        var m = Ok.Model.new(function () {});
        assert.equal(null, m.new(val));
      });
    });

    it( 'returns an object if an object passed to it', function () {
      var m = Ok.Model.new(function () {});
      assert.equal(1, (m.new({nice: 1})).data.nice);
    });

    it( 'returns an array of objects with proper prototype if array is passed to it', function () {
      var f = function () {};
      f.prototype.nice = function () {return 'is_func'; };
      var m = Ok.Model.new(f);
      var list = m.new([{nice:1}, {nice:2}]);
      assert.equal(list.length, 2);
      assert.equal('is_func', list[1].nice());
      assert.equal(1, list[0].data.nice);
    });

  }); // === end desc

}); // === end desc

