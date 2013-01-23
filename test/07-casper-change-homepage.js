
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


var form                = '#form_homepage_priv ';
var success             = form + 'div.success';
var css_specify_display = function (form) { return $(form + 'div.specify').css('display'); };
var css_submit_display  = function (form) { return $(form + 'button.submit').css('display'); };
var css_fields_display = function (form) { return $(form + 'div.fields').css('display'); };
var css_menu_selected  = function () { return $('#form_homepage_priv select option:selected').val(); };
var submit              = form + 'button.submit';
var success             = form + 'div.success';
var css_body            = function (css) { return $('body').hasClass(css); };

// === Default css classes.
casper.thenOpen(base_funcs.url + '/info/go99', function () {
});


casper.run(function () {
  this.test.renderResults(true);
});


