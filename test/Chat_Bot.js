
var _         = require('underscore')
, assert      = require('assert')
, Redis       = require('okdoki/lib/Redis').Redis
, Chat_Bot    = require('okdoki/lib/Chat_Bot').Chat_Bot
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
;


describe( 'Chat_Bot', function () {

  before(function (done) {
    Redis.client.del('send-to-bots', done);
  });

  after(function (done) {
    Redis.client.quit(done);
  });

  it( 'inserts a system message for non-existent bots', function (done) {
    var r = Redis.client.multi();

    r.rpush('send-to-bots', 'MATH@GO99:1');
    r.rpush('send-to-bots', 'MONEY@DOS:2');
    r.hmset('MATH@GO99:1', {'from':'GO99', to: 'MATH@GO99', body: 'Hi 1'});
    r.hmset('MONEY@DOS:2', {'from':'DOS',  to: 'MONEY@DOS', body: 'Hi 2'});
    r.exec(function (err, reply) {
      if (err) throw err;
      var j = Jobs.new();

      j.create('deliver ims:', "http://localhost:5000/bots/ims", function(f, g, id) {
        Chat_Bot.deliver_ims(id, function (err, mail_room) {
          assert.equal(mail_room.ims.length, 2);
          f(err, mail_room);
        });
      });

      j.create('read for:', 'GO99', function (f, g, id) {
        Screen_Name.new(id).read_ims_and_dims(function (err, ims) {
          assert.equal(ims.length, 1);
          f(err, ims);
        });
      });

      j.create('read for:', 'DOS', function (f, g, id) {
        Screen_Name.new(id).read_ims_and_dims(function (err, ims) {
          assert.equal(ims.length, 1);
          f(err, ims);
        });
      });

      j.run_fifo( done );

    });

  });
}); // === describe
