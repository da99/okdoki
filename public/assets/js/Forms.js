

var Forms = {};

Forms.callbacks = {};

Forms.Submit_able = function (selector, callbacks) {
  Forms.Show_Fields(selector   + ' button.show');
  Forms.Show_Again(selector    + ' button.show_again');
  Forms.Submit_Button(selector + ' button.submit', callbacks);
  Forms.Undo_Button(selector   + ' button.undo');
  Forms.Edit_ables(selector);
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
    setTimeout(function () {
      Forms.Submit(selector);
    }, 500);
  });

  return button;
};

Forms.Edit_ables = function (selector) {
  var form  = $(selector);
  var edits = $(selector + ' div.edit_able');
  $.each(edits, function (i, edit_able) {

    var buttons = $(edit_able).find('div.hide_able a.edit')

    if (buttons.length === 0)
      log("No a.edit found for: selector");

    buttons.click(function (e) {
      e.preventDefault();
      button = $(e.target);
      var main       = button.closest('div.edit_able');
      var hide_able  = button.closest('div.hide_able');
      var input_able = main.children('div.input_able');
      var is_textarea = main.hasClass('textarea');
      var label_text  = hide_able.find('span.title').text();
      hide_able.hide();

      if (input_able.length === 0) {

        input_able = $('<div class="input_able">' +
                       '<div class="label"></div>' +
                       '<div class="buttons">' +
                       '<a class="submit" href="#save">Save</a> ' +
                       '<a class="cancel" href="#cancel">Cancel</a>' +
                       '</div>' +
                       '</div>');

        input_able.find('div.label').text(label_text);


        var val = $.trim( hide_able.find('span.value').text());
        if (val === '[none]')
          val = '';

        if (is_textarea) {
          var input = $('<textarea></textarea>');
          input.text(val);
        } else {
          var input = $('<input type="text" value="" />');
          input.attr('value', val);
        }

        input.attr('name', button.attr('target'));
        input_able.find('div.buttons').before(input);
        main.append(input_able);

      }
      input_able.show();
    });
  });
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
  form.find('div.undo').show();

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
  if (!cb)
    return false;

  var func = cb[name];
  if (!func)
    return false;

  return func(resp);
};




