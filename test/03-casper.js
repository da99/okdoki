//
//
//  Main purpose of this file: What happens when server
//     does not start?
//
//

var opts = {
  verbose: true,
  logLevel: "info",
  onError: function (self, m) {
    console.log('FATAL: ' + m);
    self.exit();
  }
};

var b = require("/home/da/imp/MyLife/apps/SITES/okdoki/test/casper_base");
var exists = b.create_exists;
var test   = b.create_test;
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

  // ... when no screen_name is entered.
  this.click(form + ' button.submit');
  var test_func = test('assertEvalEquals', msg, "error: Check internet connection. Either that or OKdoki.com is down.", "Err msg shown: check conn.");
  this.waitFor( exists(div_errors), test_func, null, 700);
});

casper.run(function () {
  this.test.renderResults(true);
});





