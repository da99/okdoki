
Akui.test("Sign-in form display = none", function (assert) {
  assert('none', $('#sign_in').css('display'));
});

Akui.test("create account form display = none", function (assert) {
  assert('none', $('#create_account').css('display'));
});

Akui.test("Sign-in form shows on click", function (assert) {
  $('#forms a.sign_in').click();
  assert('block', $('#sign_in').css('display'));
});

Akui.test("Create-account form shows on click", function (assert) {
  $('#forms a.create_account').click();
  assert('block', $('#create_account').css('display'));
});

Akui.test("Create-account form disappears when Sign-in form appears", function (assert) {
  $('#forms a.create_account').click();
  $('#forms a.sign_in').click();
  assert('none', $('#create_account').css('display'));
});

Akui.test("Sign-in form disappears when Create-account form appears", function (assert) {
  $('#forms a.sign_in').click();
  $('#forms a.create_account').click();
  assert('none', $('#sign_in').css('display'));
});
