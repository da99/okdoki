
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
var contact = "Read my mind."

// === Creating an account
casper.start(base_url + '/', function () {
  this.test.assertHttpStatus(200);
});

casper.then(function () {
  var form = 'form#create-account';
  this.fill(form, {
    'mask_name': 'larry',
    'passphrase': phrase,
    'confirm_passphrase': phrase,
    'contact_info': contact
  }, false);
  // this.click(form, )
});
casper.run();
