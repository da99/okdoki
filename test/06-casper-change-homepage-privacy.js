
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
var css_submit_display = function (form) { return $(form + 'button.submit').css('display'); };
var css_body = function (css) { return $('body').hasClass(css); };

// === Default css classes.
casper.thenOpen(base_funcs.url + '/info/go99', function () {
  this.test.assertEval(css_body, "Body has default class: world_read.", 'world_read');
  this.test.assertEvalEquals(css_specify_display, 'none', "Specify text box hidden by default.", form);
  this.test.assertEvalEquals(css_submit_display, 'none', "Submit button hidden before any menu change.", form);
});

// === Changing privacy menu.
casper.then(function () {
  this.evaluate(function (form) { $(form + ' select.menu_priv').val('specify').change(); }, form);
  this.wait(300);
  this.test.assertEvalEquals(css_specify_display, 'block', "Specify text box shown when 'specify' selected in menu.", form);
  this.test.assertEvalEquals(css_submit_display, 'inline-block', "Submit button shown after menu change.", form);
});

casper.run(function () {
  this.test.renderResults(true);
});


