var express = require('express');
var app     = express();
var port    = process.env.PORT || 4567;
var secret  = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error('No session secret set.');
};

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app.use(express.errorHandler());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.locals.pretty = true;
app.use(express.cookieParser());
app.use(express.session({ secret: secret }));
app.use(express.csrf());

app.post('/ask', function(req, resp) {
  if(!req.session.name)
    req.session.name = "Stranger #" + (new Date()).getSeconds();

  resp.writeHead(200, { "Content-Type": "application/json" });
  var req_type = req.param('request_type', null);
  var msg = null;
  var refresh = 1.5;
  var is_notify = false;

  switch (req_type) {
    case 'latest msgs':
      if (req.param('is_dev') === 'true' || req.param('is_dev') === true) {
        msg = 'Hiya, ' + req.session.name + '! ' + (new Date()).getSeconds() ;
      } else {
        if (!req.session.nums) {
          req.session.nums = 72;
        }
        msg       = "@okdoki Not ready. Come back in " + (--req.session.nums) + " hours.";
        refresh   = 60 * 60;
      }

      resp.end(JSON.stringify({ msg: msg, success: true, refresh: refresh, notify: is_notify}));
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
      resp.end(JSON.stringify({ success: false, msg: 'Unknown request type.' }));
  }

});


app.get( '/', function (req, resp) {
  // resp.send('Not done. Come back in 15 mins.');
  resp.render('index', {title: 'OkDoki.com', token: req.session._csrf});
});

app.use(function (err, req, resp, next) {
  if (req.param('request_type', undefined) == 'latest msgs') {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({ _csrf: req.session._csrf, success: false, msg: err.toString() }));
    return true;
  };

  console.log(err);
  next()
  // res.send(500, "Something broke. Try later.");
});


app.listen(port);
console.log('Listening on: ' + port);



