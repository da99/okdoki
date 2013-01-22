
//
// === Sign-ing in
//


var base_funcs = require("/home/da/imp/MyLife/apps/SITES/okdoki/test/casper_base");
var exists_f   = base_funcs.create_exists;
var test_f     = base_funcs.create_test;
var innerHTML_f= base_funcs.innerHTML_f;
var casper     = base_funcs.new_casper("sign_in");


var msg = function () {
  return document.querySelector('#sign_in div.errors').innerHTML;
};


var form    = '#form_homepage_priv ';
var success = form + 'div.success';
var css_specify_display = function (form) { return $(form + 'div.specify').css('display'); };
var css_body = function (css) { return $('body').hasClass(css); };

casper.thenOpen(base_funcs.url + '/info/go99', function () {
  this.test.assertEval(css_body, "Body has default class: world_read.", 'world_read');
  this.test.assertEvalEquals(css_specify_display, 'none', "Specify text box hidden by default.", form);
});

casper.run(function () {
  this.test.renderResults(true);
});


