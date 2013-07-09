
// ================================================================
// =============== Chat Room ======================================
// ================================================================

var _         = require('underscore')
, Screen_Name = require('../Screen_Name/model').Screen_Name
, Website     = require('../Website/model').Website
, Folder      = require('../Folder/model').Folder
, Chat_Room_Seat = require('../Chat/model').Room_Seat
, Chat_Room_Fav  = require('../Chat/Room_Fav').Room_Fav
, Chat_Msg    = require('../Chat/model').Msg
, Faker       = require('Faker')
, log         = require("../App/base").log
;

exports.route = function (mod) {

  var app         = mod.app;
  var New_River   = mod.New_River;
  var New_Request = mod.New_Request;


  // =============== Entering the Chat Room... ======================

  app.get('/me/:screen_name/chat', function (req, resp, next) {
    var OK = New_Request(req, resp, next);
    var data = OK.template_data('Chat/index');
    data['title'] = data.screen_name + "'s Chat Room";
    OK.render_template();
  });

  app.post('/chat_room/fav', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod
    .New_River(req, resp, next)
    .create_one('chat room fav', function (j) {
      Chat_Room_Fav.create({
        owner_screen_name     : req.body.as_this_life,
        chat_room_screen_name : req.body.chat_room_screen_name
      }, j);
    })
    .run(function (fin, fav) {
      resp.json({
        success: true,
        msg: "You're entering: " + fav.data.chat_room_screen_name,
        chat_room_screen_name: fav.data.chat_room_screen_name,
        owner_screen_name    : req.body.as_this_life
      });
    });
  });

  app.post('/enter/chat_room', function (req, resp, next) {
    var OK = mod.New_Request(arguments);

    mod.New_River(req, resp, next)

    .create_one('seat', function (j, room) {
      Chat_Room_Seat.create({
        chat_room_screen_name : req.body.chat_room_screen_name,
        owner_screen_name     : req.body.as_this_life
      }, j);
    })

    .run(function (fin, seat) {

      var data = {
        owner_screen_name     : seat.data.owner_screen_name,
        chat_room_screen_name : seat.data.chat_room_screen_name,
        max_time              : seat.max_time()
      };

      if (!seat)
        return OK.json(_.extend({ success: false, msg: "Chat room unavailable." }, data));

      OK.json(_.extend({
        success : true,
        msg     : "Success: You're in, " + seat.data.chat_room_screen_name + ", as " + seat.data.owner_screen_name,
      }, data));

    });

  }); // === post /enter/chat_room

  // =============== "Listening" to the Chat Room... ================
  app.post('/me/:screen_name/chat/msgs', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod
    .New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('room', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .create_one('seat', function (j, room) {
      Chat_Room_Seat.create_by_room(room, j);
    })
    .read_list('seat_list', function (j, seat) {
      Chat_Room_Seat.read_list_by_room(j.river.reply_for('room'), j);
    })
    .read_list('msg_list', function (j, list) {
      Chat_Msg.read_list_by_room_and_last_created_at(j.river.reply_for('room'), req.body.last_created_at,j);
    })
    .run(function (fin, room) {
      if (!fin.river.reply_for('seat'))
        return OK.json({success: false, msg: "Chat room unavailable."});

      var test_name = Faker.Name.firstName();
      var msgs = fin.river.replys_for('read_msgs');
      var seats = fin.river.replys_for('read_seat_list');

      seats.push({
        screen_name : test_name,
        is_out      : (parseInt(Math.random() * 10) % 2) === 0
      });

      msgs.push({
        id : (new Date).getTime(),
        author_screen_name : test_name,
        body               : Faker.Lorem.paragraph(),
        created_at         : (new Date),
        created_at_epoch   : (new Date).getTime()
      });

      msgs.push({
        id : 100,
        author_screen_name : 'T___' + test_name,
        body               : "test msg",
        created_at         : (new Date),
        created_at_epoch   : (new Date).getTime()
      });

      OK.json({
        success : true,
        msg     : "Done.",
        seats   : seats,
        msgs    : msgs
      });
    });
  });

  // =============== Leaving the Chat Room... =======================

  app.post('/chat_room/leave', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    OK.json({success: true, msg: "BYE BYE: You're officially out of the room."});
  });


  // =============== Speaking to the Chat Room... ===================

  app.post('/me/:screen_name/chat/msg', function (req, resp, next) {
    var OK = mod.New_Request(arguments);
    mod
    .New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('room', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_one('seat', function (j, room) {
      Chat_Room_Seat.read_by_room_and_screen_name_id(room, req.body.life_id, j);
    })
    .create_one('msg', function (j, seat) {
      Chat_Msg.create_by_seat_and_body(seat, req.body.body, j);
    })
    .run(function (fin, msg) {
      if (!msg)
        return OK.json({success: false, msg: "Chat room unavailable."});

      msg.data.author_screen_name = req.body.as_this_life;

      OK.json({
        success: true,
        msg: "Message sent to the chat room.",
        chat_msg: msg.data
      });
    });

  });


  // ==================== OLD =====================================
  app.post('/ask', function(req, resp, next) {
    var data = req.body;
    var is_dev = data.is_dev === true;

    var req_type = data.request_type;
    var msg = null;
    var refresh = 1.5;
    var is_notify = false;

    var get_latest_msg = function (req, resp) {
      var query = new db.query("SELECT * FROM bot_chat WHERE date > $1", [req.body.date], function (meta) {

        var result = meta.rows;
        if (meta.rowCount > 0)
          resp.json( { msg: result, success: true, refresh: 10 } );
        else
          resp.json( { msg: [], success: true, refresh: 10 } );

      });

      query.run()
    }


    switch (req_type) {
      case 'latest msgs':
        get_latest_msg(req, resp);
      break;

      case 'save msg':
        if (req.ip === ip_addr || (is_dev && req.ip === '127.0.0.1')) {
        var text = 'INSERT INTO bot_chat(date, msg, author) VALUES($1, $2, $3) RETURNING id';
        var vals = [ (new Date).getTime(), data.msg, data.author ];
        var query = new db.query(text, vals, function (err, meta) {

          if (meta.rowCount) {
            get_latest_msg(req, resp)
            // resp.end(JSON.stringify({ msg: { msg: req.param('msg'), id: meta.rows[0].id, author: req.param('author') }, success: true, refresh: 6 }));
          } else {
            write.json( resp, { msg: "Failed.", success: false, refresh: 6 } );
          }

        });

        query.run();

      } else  {
        write.json( resp, { msg: "inserted", success: true, refresh: 600000 } );
      }

      break;
      case 'bots list':
        var bots_list = {
        'okdoki'              : {subscribed: true, url: 'http://www.okdoki.com/ask' },
        'Clock.Bot'           : {subscribed: true, url: 'http://okdoki-clock-bot.heroku.com/ask' },
        'Obama.Miracles'      : {subscribed: true, url: 'http://okdoki-obama-miracles.heroku.com/ask'},
        'Mr.Liberty'          : {subscribed: true, url: 'http://okdoki-mr-liberty.heroku.com/ask'},
        'Tech.Toys'           : {subscribed: true, url: 'http://okdoki-tech-toys.heroku.com/ask'},
        'Hearts.Club'         : {subscribed: true, url: 'http://okdoki-hearts-club.heroku.com/ask'},
        'Gossip.News.Network' : {subscribed: true, url: 'http://okdoki-gossip-news-network.heroku.com/ask'},
        'My.Astro.Future'     : {subscribed: true, url: 'http://okdoki-my-astro-future.heroku.com/ask'},
        'Good.News'           : {subscribed: true, url: 'http://okdoki-good-news.heroku.com/ask'},
        'Bad.News'            : {subscribed: true, url: 'http://okdoki-bad-news.heroku.com/ask'},
        'American.Sports'     : {subscribed: true, url: 'http://okdoki-american-sports.heroku.com/ask'},
        'Biz.Rumors'          : {subscribed: true, url: 'http://okdoki-biz-rumors.heroku.com/ask'},
        'Global.War'          : {subscribed: true, url: 'http://okdoki-global-war.heroku.com/ask'},
        'Men.Of.Action'       : {subscribed: true, url: 'http://okdoki-men-of-action.heroku.com/ask'},
        'Beauty.Gene'         : {subscribed: true, url: 'http://okdoki-beauty-gene.heroku.com/ask'},

        'Mr.Sci.Tech'         : {subscribed: false, url: 'http://okdoki-mr-sci-tech.heroku.com/ask'},
        'history-bot'         : {subscribed: false, url: 'http://okdoki-history-bot.heroku.com/ask'},
        'Econo.Liberty'       : {subscribed: false, url: 'http://okdoki-econo-liberty.heroku.com/ask'},
        'Kuala.Lumpur'        : {subscribed: false, url: 'http://okdoki-kuala-lumpur.heroku.com/ask'},
        'Tokyo.Mania'         : {subscribed: false, url: 'http://okdoki-tokyo-mania.heroku.com/ask'},
        'Osaka.Jonny'         : {subscribed: false, url: 'http://okdoki-osaka-jonny.heroku.com/ask'}
      };

      break;

      default:
        write.json( resp, { success: false, msg: 'Unknown request type.' } );
    }

  });


  app.post("/chat/heart-beep", function (req, resp, next) {
    require_log_in()
    var dev_ip = '127.0.0.1';
    var is_dev = dev_ip === req.ip;

    var expires = []
      , user      = req.user
      , since     = since_OST()
      , m         = null
      , delete_old= false
      , cmd_q     = []
      , new_messages = []
    ;

    var secs   = 4; // How many seconds for next heart beep.
    var status = 200;

    // Save message.
    if (is_dev && !req.body.message) {
      req.body.message = {message_body: 'No message.', owner_screen_name: req.user.screen_names()[0]};
    }

    var obj = {
      menu    : {},
      message : req.body_message,
      msgs    : new_messages
    };

    var r = New_River(next);

    _.each(req.user.screen_names(), function (n, i) {

      var s = Screen_Name.new(n);

      r.job('refresh:', n, function (r) {
        s.heart_beep(r);
      });

      r.job('ims for:', n, function (r) {
        s.read_messages(r);
      });

      r.job('delete old ims for:', n, function (r) {
        s.delete_old_ims(r);
      });

      var im = req.body.message;
      if (im && im.owner_screen_name === n) {
        r.job('create im by:', n, function (r) {
          s.create_im(im, r);
        });
      }

    });

    r.run(function () {
      obj.msgs    = _.compact(_.flatten(r.replys_for('ims for:'), 1));
      obj.message = r.reply_for('create im by:');
      write.json_success(resp, "Fin.", obj);
    });

  }); // app.post /chat/heart-beep

}; // === route



