
Akui.test("log-in form display = none", function (assert) {
  assert('none', $('#sign_in').css('display'));
});

Akui.test("create account form display = none", function (assert) {
  assert('none', $('#create_account').css('display'));
});

Akui.test("Log-in form shows on click", function (assert) {
  $('#forms a.sign_in').click();
  assert('block', $('#sign_in').css('display'));
});

Akui.test("Create-account form shows on click", function (assert) {
  $('#forms a.create_account').click();
  assert('block', $('#create_account').css('display'));
});
