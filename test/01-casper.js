
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
var phrase     = 'Hoppe gives us hope';
var contact    = "someone@miniuni.zbc";

casper.on('http.status.404', function(resource) {
    this.echo('wait, this url is 404: ' + resource.url);
});

casper.on('http.status.500', function(resource) {
    this.echo('woops, 500 error: ' + resource.url);
});

// === Make sure frontpage is working.
//
casper.start(base_url + '/', function () {
  this.test.assertHttpStatus(200);
});

// === Creating an account

casper.then(function () {

  // === see if errors are displayed.
  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';
  this.fill(form, {
    'screen_name': '',
    'passphrase': '',
    'confirm_passphrase': '',
    'email': contact
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertExists(div_errors, div_errors + ' in form exist.');
  }, null, 700);

});

// === see if screen name errors are displayed
casper.open(base_url + '/').then(function () {
  // === see if errors are displayed.
  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';

  this.fill(form, {
    'screen_name'        : '',
    'passphrase'         : phrase,
    'confirm_passphrase' : phrase,
    'email'              : contact
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertEqual(this.fetchText(div_errors), "Name, \"\", must be 3-15 chars: 0-9 a-z A-Z _ - .", " Screen name errors when creating account. ");
  }, null, 700);
});

// === Creating a screename
//

// === Sign-ing in
var msg = function () {
  return document.querySelector('#sign_in div.errors').innerHTML;
};

casper.then(function () {
  var form = 'form#form_sign_in';
  var div_errors = form + ' div.errors';

  // ... when no screen_name is entered.
  this.click(form + ' button.submit');
  var test_func = test_f('assertEvalEquals', msg, "Username is required.", "Msg shown: Username is required.");
  this.waitFor( exists_f(div_errors), test_func, null, 700);

});


casper.then( function () {
  var sign_in = '#sign_in form';
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
