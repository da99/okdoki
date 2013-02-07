
var _      = require('underscore')
, assert   = require('assert')
, Chat_Bot = require('okdoki/lib/Chat_Bot').Chat_Bot
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
;


describe( 'Chat_Bot', function () {

  before(function (done) {
    Chat_Bot.redis.del('send-to-bots', done);
  });

  after(function (done) {
    Chat_Bot.redis.quit(function () { done() });
  });

  it( 'inserts a system message for unreachable bots', function (done) {
    var r = Chat_Bot.redis.multi();

    r.rpush('send-to-bots', 'MATH@GO99:1');
    r.rpush('send-to-bots', 'MONEY@DOS:2');
    r.hmset('MATH@GO99:1', {'from':'GO99', to: 'MATH@GO99', body: 'Hi 1'});
    r.hmset('MONEY@DOS:2', {'from':'DOS',  to: 'MONEY@DOS', body: 'Hi 2'});
    r.exec(function (err, reply) {
      if (err) throw err;
      Chat_Bot.deliver_ims("http://localhost:5000/bots/ims", function (mail_room) {
        assert.equal(mail_room.ims.length, 2);
        Screen_Name.new('GO99').read_ims_and_dims(function (msgs) {
          assert.equal(msgs.length, 1);
          Screen_Name.new('DOS').read_ims_and_dims(function (msgs) {
            assert.equal(msgs.length, 1);
            done();
          });
        });
      });
    });

  });
}); // === describe
