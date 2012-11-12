var express = require('express');
var app     = express();
var port    = process.env.PORT || 4567;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app.use(express.errorHandler());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.locals.pretty = true;
app.use(express.cookieParser());
app.use(express.session({ secret: 'avc' }));
app.use(express.csrf());

app.get('/', function(req, resp) {
  resp.send('Not done. Come back in 72 hours.');
});

app.post('/ask', function(req, resp) {
  if(!req.session.name) {
    req.session.name = (new Date()).getSeconds();
  };
  resp.writeHead(200, { "Content-Type": "text/plain" });
  resp.end('Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, Hiya, ' + req.session.name + '! ' + (new Date()).getTime());
});

app.get( '/dev', function (req, resp) {
  resp.render('index', {title: 'Done :p', token: req.session._csrf});
});

app.use(function (err, req, res, next) {
  if(req.param('request_type', undefined)) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end(req.session._csrf);
    return true;
  };

  console.log(err);
  next()
  // res.send(500, "Something broke. Try later.");
});


app.listen(port);
console.log('Listening on: ' + port);



