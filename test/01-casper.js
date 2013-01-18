//
// === Sign-ing in
//


var opts = {
  verbose: true,
  logLevel: "info",
  onError: function (self, m) {
    console.log('FATAL: ' + m);
    self.exit();
  }
};


var base_funcs = require("/home/da/imp/MyLife/apps/SITES/okdoki/test/casper_base");
var exists_f   = base_funcs.create_exists;
var test_f     = base_funcs.create_test;
var casper     = require('casper').create(opts);
var base_url   = 'http://localhost:' + casper.cli.args[0];

var msg = function () {
  return document.querySelector('#sign_in div.errors').innerHTML;
};

casper.start(base_url + '/');

casper.then(function () {
  this.test.assertHttpStatus(200);
  var form = 'form#form_sign_in';
  var div_errors = form + ' div.errors';

  // ... when no screen_name is entered.
  this.click(form + ' button.submit');
  var test_func = test_f('assertEvalEquals', msg, "Username is required.", "Msg shown: Username is required.");
  this.waitFor( exists_f(div_errors), test_func, null, 700);

});


casper.then( function () {
  var sign_in = 'form#form_sign_in';
  var div_errors = sign_in + ' div.errors';

  // ... when no password is entered.
  this.fill(sign_in, {
    'screen_name': 'go99',
    'passphrase': "",
  }, false);
  this.click(sign_in + ' button.submit');
  var test_func = test_f( 'assertEvalEquals', msg, "Password is required.", "Msg shown: Password is required.");
  this.waitFor(exists_f(div_errors), test_func, null, 700);
});

casper.run(function () {
  this.test.renderResults(true);
});


