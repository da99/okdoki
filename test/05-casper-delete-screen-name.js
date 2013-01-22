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


var form    = '#form_trash_screen_name ';
var success = form + 'div.success';
var success_msg = "Screen name, go99, has been put in trash." +
  " You have 2 days from now to change your mind before it gets completely deleted.";

casper.thenOpen(base_funcs.url + '/info/go99', function () {
  this.click(form + 'button.submit');
  this.waitForSelector(success, function () {
    this.test.assertEquals(this.fetchText(success), success_msg, "Msg: Time until complete deletion.");
    this.test.assertEvalEquals(function (form) { return $(form + 'button.submit').css('display'); }, 'none', 'Delete button display=none.', form);
    this.test.assertEvalEquals(function (form) { return $(form + 'button.unsubmit').css('display'); }, 'inline-block', 'Un-Delete button display=inline-block.', form);
  }, null, 1000);
});

casper.then(function () {
  this.reload(function () {

    this.test.assertEquals( this.fetchText(success), success_msg, "Delete/un-delete message shown on page reload.");
    this.test.assertEvalEquals(function (form) { return $(form + 'button.submit').css('display'); }, 'none', 'Delete button display=none.', form);
    this.test.assertEvalEquals(function (form) { return $(form + 'button.unsubmit').css('display'); }, 'inline-block', 'Un-Delete button display=inline-block.', form);

  });
});

// === Success
//


casper.run(function () {
  this.test.renderResults(true);
});


