

var Forms = {};

Forms.callbacks = {};

Forms.Submit_able = function (selector, callbacks) {
  Forms.Show_Fields(selector   + ' button.show');
  Forms.Show_Again(selector    + ' button.show_again');
  Forms.Submit_Button(selector + ' button.submit', callbacks);
}

Forms.Show_Fields = function (selector) {
  $(selector).click(function (e) {
    e.preventDefault();
    var button = $(e.target);
    button.closest('div.show').hide();
    button.closest('form').find('div.fields').show();
  });
};

Forms.Show_Again = function (selector) {
  $(selector).click(function (e) {
    e.preventDefault();
    var button = $(e.target);
    button.closest('div.show_again').hide();
    button.closest('form').find('div.fields').show();
    button.closest('form').find('div.success').remove();
  });
};

Forms.Submit_Button = function (selector, callbacks) {
  var button = $(selector);
  var form   = button.closest('form');

  if (callbacks) {
    Forms.callbacks[selector] = callbacks;
  };

  button.click(function (e) {
    e.preventDefault();
    form.children('div.errors').remove();
    form.children('div.success').remove();
    form.addClass('loading');
    setTimeout(function () {
      Forms.Submit(selector);
    }, 500);
  });

  return button;
};

Forms.Submit = function (selector) {
  var form = $(selector).closest('form');
  var ajax_o = Forms.Default_Ajax_Options(selector);
  log(ajax_o);
  Forms.call_callback(selector, 'before_submit', ajax_o);
  $.ajax(ajax_o);
  return form;
};

Forms.Success = function (selector, resp, stat) {
  var form = $(selector).closest('form');
  if (stat !== 'success') {
    Forms.Errors(form, "Unknown error.");
    return form;
  };

  if (!resp.success) {
    Forms.Errors(form, resp.msg);
    return form;
  };

  Forms.call_callback(selector, 'before_success', resp);
  form.children('div.fields').hide();
  form.removeClass('loading');
  log(stat);
  var e = $('<div></div>');
  e.addClass('success');
  e.text(resp.msg);
  form.prepend(e);
  form.find('div.show_again').show();

  Forms.call_callback(selector, 'after_success', resp);
  return form;
};

Forms.Errors = function (form, msg) {
  form.removeClass('loading');
  var e = $('<div></div>');
  e.addClass('errors');
  e.text(msg);
  form.append(e);

  return form;
};

Forms.Default_Ajax_Options = function (selector) {
  var form = $(selector).closest('form');
  var obj  = {};
  $.each(form.serializeArray(), function (i, ele) {
    obj[ele.name] = ele.value;
  });

  return { type: 'POST',
    url : window.location.origin + form.attr('action'),
    cache: false,
    contentType: 'application/json',
    data : JSON.stringify(obj),
    dataType: 'json',
    success: function (resp, stat) {
      Forms.Success(selector, resp, stat);
    },
    error: function (xhr, textStatus, errThrown) {
      Forms.Errors(form, textStatus + ': ' + (errThrown || "Check internet connection. Either that or OKdoki.com is down.") );
    }
  };
};

Forms.call_callback = function (id, name, resp) {
  var cb = Forms.callbacks[id];
  log(Forms.callbacks)
  if (!cb)
    return false;

  var func = cb[name];
  if (!func)
    return false;

  return func(resp);
};




