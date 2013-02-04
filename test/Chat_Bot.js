
var _      = require('underscore')
, assert   = require('assert')
, Chat_Bot = require('okdoki/lib/Chat_Bot').Chat_Bot
;


describe( 'Chat_Bot', function () {

  after(function () {
    Chat_Bot.redis.quit();
  });

  it( 'inserts a system message for unreachable how', function (done) {
    var r = Chat_Bot.redis.multi();

    r.rpush('send-to-bots', 'MATH@GO99:1');
    r.rpush('send-to-bots', 'MONEY@DOS:2');
    r.hmset('MATH@GO99:1', {'from':'GO99', to: 'MATH@GO99', body: 'Hi 1'});
    r.hmset('MONEY@DOS:2', {'from':'DOS',  to: 'MONEY@DOS', body: 'Hi 2'});
    r.exec(function (err, reply) {
      if (err) throw err;
      Chat_Bot.send_ims(function (err, mail_room) {
        assert.equal(err, null);
        assert.equal(mail_room.ims, 1);
        assert.equal(true, false);
        done();
      });
    });

  });
}); // === describe
