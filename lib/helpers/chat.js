var _ = require('underscore');

var chat = exports.chat = {
  add: function (app) {
    _.each(chat.funcs, function (meta, name) {
      app[meta.method](meta.path, meta.func);
    });
  }
};

chat.funcs = [];
chat.funcs.push({
  method: 'post',
  path: '/ask',
  func: function(req, resp) {
  var data = req.body;
  var is_dev = data.is_dev === true;
  if(!req.session.name)
    req.session.name = "Stranger #" + (new Date()).getSeconds();

  resp.writeHead(200, { "Content-Type": "application/json" });
  var req_type = data.request_type;
  var msg = null;
  var refresh = 1.5;
  var is_notify = false;

  var get_latest_msg = function (req, resp) {
    var query = new db.query("SELECT * FROM bot_chat WHERE date > $1", [req.body.date], function (meta) {

      var result = meta.rows;
      if (meta.rowCount > 0)
        write.json( resp, { msg: result, success: true, refresh: 10 } );
      else
        write.json( resp, { msg: [], success: true, refresh: 10 } );

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

}
});



