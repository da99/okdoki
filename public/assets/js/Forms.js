

var Forms = {};

Forms.callbacks = {};

Forms.Submit_able = function (selector, callbacks) {
  Forms.Show_Fields(selector   + ' button.show');
  Forms.Show_Again(selector    + ' button.show_again');
  Forms.Submit_Button(selector + ' button.submit', callbacks);
  Forms.Undo_Button(selector   + ' button.undo');
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

Forms.Undo_Button = function (s) {
  $(s).click(function (e) {
    e.preventDefault();
    var b    = $(e.target);
    var block = b.closest('div.undo');
    var form = b.closest('form');

    form.removeClass('success');
    form.addClass('loading');
    form.find('div.success').remove();
    b.closest('div.undo').hide();

    var ajax_o = Forms.Default_Ajax_Options(form);
    log(ajax_o);
    ajax_o.url = ajax_o.url.replace(/[^\/]\/[^\/]/, function (s) {
      return s.replace('/', '/undo/');
    });

    ajax_o.success = function (resp, stat) {
      Forms.Success(b, resp, stat);

      if (block.hasClass('trash')) {
        form.removeClass('trashed');
      }
      form.children('div.fields').show();
      block.hide();
    };

    $.ajax(ajax_o);
    return form;
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
    Forms.Submit(selector);
  });

  return button;
};

Forms.Submit = function (selector) {
  var ajax_o = Forms.Default_Ajax_Options(selector);
  log(ajax_o);
  Forms.call_callback(selector, 'before_submit', ajax_o);
  var timeout = setTimeout(function () {
    $.ajax(ajax_o);
  }, 500);

  return {selector: selector, ajax_options: ajax_o, timeout: timeout};
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
  form.find('div.undo').show();

  Forms.call_callback(selector, 'after_success', resp);
  return form;
};

Forms.Errors = function (selector, msg) {
  var form = $(selector).closest('form');
  form.removeClass('loading');
  var e = $('<div></div>');
  e.addClass('errors');
  e.text(msg);
  form.append(e);

  return form;
};

Forms.vals = function (form) {
  var obj  = {};
  $.each(form.serializeArray(), function (i, o) {
    var v        = $.trim(o.value);
    var is_array = o.name.indexOf('[]') > -1;
    var n        = o.name.replace('[]', '');

    if (obj.hasOwnProperty(n)) {
        obj[n].push(v);
    } else {
      if (is_array) {
        if (v === 'null')
          obj[n] = [];
        else
          obj[n] = [v];
      } else
        obj[n] = v;
    }
  });

  return obj;
};

Forms.Default_Ajax_Options = function (selector) {
  var form = $(selector).closest('form');
  var obj  = Forms.vals(form);
  var action = window.location.origin + form.attr('action');

  return { type: 'POST',
    url         : action,
    cache       : false,
    contentType : 'application/json',
    data        : JSON.stringify(obj),
    dataType    : 'json',
    success     : function (resp, stat) {
      Forms.Success(selector, resp, stat);
    },
    error: function (xhr, textStatus, errThrown) {
      Forms.Errors(selector, textStatus + ': ' + (errThrown || "Check internet connection. Either that or OKdoki.com is down.") );
    }
  };
};

Forms.call_callback = function (id, name, resp) {
  var cb = Forms.callbacks[id];
  if (!cb)
    return false;

  var func = cb[name];
  if (!func)
    return false;

  return func(resp);
};




