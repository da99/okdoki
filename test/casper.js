
var opts = {
  verbose: true,
  logLevel: "info",
  onError: function (self, m) {
    console.log('FATAL: ' + m);
    self.exit();
  }
};
var casper = require('casper').create(opts);
var base_url = 'http://localhost:' + casper.cli.args[0];
var phrase = 'Hoppe gives us hope';
var contact = "someone@miniuni.zbc"

// === Make sure frontpage is working.
//
casper.start(base_url + '/', function () {
  this.test.assertHttpStatus(200);
});

// === Creating an account

casper.then(function () {
  var form = 'form#form_create_account';
  var div_errors = form + ' div.errors';
  this.fill(form, {
    'mask_name': '',
    'passphrase': phrase,
    'confirm-passphrase': phrase,
    'email': contact
  }, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertExists(div_errors, div_errors + ' in form exist.');
  }, null, 700);

});

// === Sign-ing in

casper.then(function () {
  var form = 'form#form_sign_in';
  var div_errors = form + ' div.errors';
  this.fill(form, {}, false);

  this.click(form + ' button.submit');

  this.waitFor(function check() {
    return this.exists(div_errors);
  }, function then() {
    this.test.assertExists(div_errors, div_errors + ' in form exist.');
  },
  null, 700);

});




casper.run();
