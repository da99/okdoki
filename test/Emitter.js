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

  describe( 'before/middle/after positioning', function () {
    it( 'runs methods in order', function (done) {
      var em = Emitter.new('something');
      var counter = 0;

      em.on('before something', function (name, arg) {
        assert.equal(name, 'something');
        assert.equal(counter,  0);
        counter++;
      });

      em.on('after something', function (name, arg) {
        assert.equal(name, 'something');
        assert.equal(counter,  2);
        done();
      });

      em.on('something', function (name, arg) {
        assert.equal(name, 'something');
        assert.equal(counter,  1);
        counter++;
      });

      em.emit('something');
    });
  }); // === end desc



}); // === end desc

