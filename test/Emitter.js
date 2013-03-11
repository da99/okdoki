var _     = require('underscore')
, assert  = require('assert')
, Emitter = require('okdoki/lib/Emitter').Emitter
;


describe( 'Emitter', function () {

  describe( 'invalid event name', function () {

    it( 'throw if no events specified', function (done) {
      var error = null;
      var em    = null;

      try {
        em = Emitter.new('something');
        em.on('something else', function() {});
      } catch (e) {
        error = e;
      }

      assert.equal(error.message, "Invalid event name: method: on, name: something else");
      done();
    });

    it( 'runs specified event', function (done) {
      var em = Emitter.new('something');
      em.on('invalid event name', function (name, msg) {
        assert.equal(name, "invalid event name");
        assert.equal(msg, "method: on, name: something else");
        done();
      });

      em.on('something else', function () { });
    });

  }); // === end desc

}); // === end desc

