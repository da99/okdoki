var _     = require('underscore')
, assert  = require('assert')
, Emitter = require('okdoki/lib/Emitter').Emitter
;


describe( 'Emitter', function () {

  describe( 'ordering of methods', function () {
    it( 'runs method in order specified', function (done) {
      var em = Emitter.new('something');
      var counter = 1;
      em.on('something', function () {
        assert.equal(counter, 1);
        counter = 2;
      });

      em.on('something', function () {
        assert.equal(counter, 2);
        counter = 3;
      });

      em.on('something', function () {
        assert.equal(counter, 3);
        done();
      });

      em.emit('something');
    });
  }); // === end desc

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

      assert.equal(error.message, "invalid event name: name: something else");
      done();
    });

    it( 'runs specified event', function (done) {
      var em = Emitter.new('something');
      em.on('invalid event name', function (msg) {
        assert.equal(msg, "name: something else");
        done();
      });

      em.on('something else', function () { });
    });

  }); // === end desc

  describe( 'before/middle/after positioning', function () {
    it( 'runs methods in order', function (done) {
      var em = Emitter.new('something');
      var counter = 0;

      em.on('before', 'something', function (arg) {
        assert.equal(counter,  0);
        counter++;
      });

      em.on('after', 'something', function (arg) {
        assert.equal(counter,  2);
        done();
      });

      em.on('something', function (arg) {
        assert.equal(counter,  1);
        counter++;
      });

      em.emit('something');
    });
  }); // === end desc

  describe( 'run "before event" only', function () {
    it( 'does not run middle or after events', function (done) {
      var em = Emitter.new('job');
      em.on('before', 'job', function (arg) { assert.equal(arg, 1); });
      em.on('job', function (arg) { throw new Error('should not get here'); });
      em.on('after', 'job', function (arg) { throw new Error('should not get here'); });
      em.emit('before', 'job', 1);
      done();
    });
  }); // === end desc

  describe( 'run "middle event" only', function () {
    it( 'does not run before or after events', function (done) {
      var em = Emitter.new('job');
      em.on('before', 'job', function (arg) { throw new Error('should not get here'); });
      em.on('job', function (arg) { assert.equal(arg, 1); });
      em.on('after', 'job', function (arg) { throw new Error('should not get here'); });
      em.emit('middle', 'job', 1);
      done();
    });
  }); // === end desc

  describe( 'run "after event" only', function () {
    it( 'does not run before or middle events', function (done) {
      var em = Emitter.new('job');
      em.on('before', 'job', function (arg) { throw new Error('should not get here'); });
      em.on('job', function (arg) { throw new Error('should not get here'); });
      em.on('after', 'job', function (arg) { assert.equal(arg, 1); });
      em.emit('after', 'job', 1);
      done();
    });
  }); // === end desc


  describe( 'event run', function () {
    it( 'includes name of current event', function (done) {
      var em = Emitter.new('my_run');
      em.on('my_run', function () {
        assert.equal('my_run', this.name);
        done();
      });
      em.emit('my_run');
    });

    it( 'includes emitter', function (done) {
      var em = Emitter.new('my_run');
      em.on('my_run', function () {
        assert.equal(em, this.emitter);
        done();
      });
      em.emit('my_run');
    });
  }); // === end desc

  describe( 'stop propagation', function () {
    it( 'does not run other events after calling stop.', function (done) {

      var em = Emitter.new('something');
      var counter = 1;
      em.on('something', function () {
        assert.equal(counter, 1);
      });

      em.on('something', function () {
        assert.equal(counter, 1);
        this.stop();
      });

      em.on('something', function () {
        throw new Error('should not get here');
      });

      em.emit('something');
      done();
    });
  }); // === end desc

}); // === end desc

