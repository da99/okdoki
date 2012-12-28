

var Forms = {};

Forms.Submit_Button = function (id) {
  var button  = $('#' + id);
  var form = button.closest('form');
  button.click(function (e) {
    e.preventDefault();
    form.addClass('loading');
  });

  return button;
};

Forms.Submit = function (id) {
  var form = $('#' + id);
  form.addClass('loading');
  return form;
};
