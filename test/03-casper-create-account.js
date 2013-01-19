//
// === Creating an account
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
var phrase     = 'Hoppe gives us hope';
var contact    = "someone@miniuni.zbc";


base_funcs.prepare(casper);

// === Make sure frontpage is working.
//
casper.start(base_url + '/', function () {
  this.test.assertHttpStatus(200);
});

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
casper.then(function () {

  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';

  // === see if screen name errors are displayed.
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

// === see if passphrase errors are displayed
casper.then(function () {

  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';

  this.fill(form, {
    'screen_name'        : 'go99',
    'passphrase'         : "",
    'confirm_passphrase' : "",
    'email'              : contact
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertEqual(this.fetchText(div_errors), "Passphrase must be at least 9 chars long.", " Passphrase errors when creating account. ");
  }, null, 900);

});

// === see if passphrase confirm errors are displayed
casper.then(function () {

  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';

  this.fill(form, {
    'screen_name'        : 'go99',
    'passphrase'         : phrase,
    'confirm_passphrase' : phrase + "u",
    'email'              : contact
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertEqual(this.fetchText(div_errors), "Passphrase confirmation does not match passphrase.", " Passphrase confirm errors when creating account. ");
  }, null, 900);

});

// === Email is optional for creating an account.
casper.then(function () {

  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';

  this.fill(form, {
    'screen_name'        : 'go99',
    'passphrase'         : phrase,
    'confirm_passphrase' : phrase,
    'email'              : ""
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists("#homepages");
  }, function then() {
    this.test.assertTextExists("Welcome, go99", " Email optional when creating account. ");
  }, null, 900);

});


casper.run(function () {
  this.test.renderResults(true);
});



