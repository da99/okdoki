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

app.get('/', function (req, resp) {
    resp.send('Not done. Come back in 72 hours.');
});

app.post('/ask', function(req, resp) {
  if(!req.session.name)
    req.session.name = (new Date()).getSeconds();

  resp.writeHead(200, { "Content-Type": "application/json" });
  var msg = 'Hiya, ' + req.session.name + '! ' + (new Date()).getTime();
  resp.end(JSON.stringify({ msg: msg, success: true}));
});

app.get( '/dev', function (req, resp) {
  resp.render('index', {title: 'Done :p', token: req.session._csrf});
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



