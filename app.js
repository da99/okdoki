
var express = require('express'),
pub         = __dirname + '/public',
app         = express();

app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get( '/', function (req, res) {
  res.render('index', {title: 'Done :p'});
});

app.use(function (err, req, res, next) {
  res.send(500, "Something broke. Try later.");
});

var port = 4567;
app.listen(port);
console.log('Listening on port: ' + port);
