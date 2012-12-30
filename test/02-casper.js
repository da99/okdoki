
var opts = {
  verbose: true,
  logLevel: "info",
  onError: function (self, m) {
    console.log('FATAL: ' + m);
    self.exit();
  }
};

function exists( s ) {
  return function () {
    return this.exists(s);
  };
};

function test() {
  var type = arguments[0];
  var args = [];
  var l = arguments.length;
  var i = 1;
  while (i < l) {
    args.push(arguments[i]);
    i++;
  };
  return function () {
    this.test[type].apply(this.test, args);
  };
};

var casper = require('casper').create(opts);
var base_url = 'http://localhost:' + casper.cli.args[0];
var phrase = 'Hoppe gives us hope';
var contact = "someone@miniuni.zbc"

// === Load page.
var msg = function () {
  return document.querySelector('#sign_in div.errors').innerHTML;
};

casper.start(base_url + '/', function () {
});


// === Check error message when connection is off.
casper.wait(1200, function () {
  var form = 'form#form_sign_in';
  var div_errors = form + ' div.errors';

  // ... when no mask_name is entered.
  this.click(form + ' button.submit');
  var test_func = test('assertEvalEquals', msg, "error: Check internet connection. Either that or OKdoki.com is down.", "Err msg shown: check conn.");
  this.waitFor( exists(div_errors), test_func, null, 700);
});

casper.run(function () {
  this.test.renderResults(true);
});
