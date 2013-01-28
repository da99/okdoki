
function Edit_able_s(selector) {

  $(selector).children('div.edit_able').each(function (i, edit) {
    Edit_able.new(edit);
  });

  return this;
}

Edit_able_s.new = function (selector) {
  return (new Edit_able_s(selector));
};

// =================================================================================================

function Edit_able(selector) {
  var me = this;
  me.$ = $(selector);
  me.$.find('a.edit').click(function (e) {me.edit(e)});
  return me;
}

Edit_able.new = function (selector) {
  return (new Edit_able(selector));
};

Edit_able.prototype.hide_able = function () {
  return this.$.children('div.hide_able');
};

Edit_able.prototype.input_able = function () {
  return this.$.children('div.input_able');
};

Edit_able.prototype.error = function (msg) {
  log(msg)
  this.$.removeClass('loading');
  var err = $('<div class="error"></div>');
  err.text(msg);
  this.input_able().append(err);

  return err;
};

Edit_able.prototype.reset = function (e) {
  e.preventDefault();
  this.$.removeClass('loading');
  this.input_able().remove();
  this.hide_able().show();
};

Edit_able.prototype.success = function (e) {
  this.reset(e);
};

Edit_able.prototype.cancel = function (e) {
  this.reset(e);
};

Edit_able.prototype.loading = function () {
  this.$.addClass('loading');
  this.$.find('div.success, div.error').remove();
  return this;
};

Edit_able.prototype.vals = function () {
  var home            = this.$.closest('div.edit_able_s');
  var vals            = {};
  var input_selectors = 'select, textarea, input';
  var inputs          = [];

  $.merge(home.children('div.common'), this.$).find(input_selectors).each(function (i, raw_e) {
    var e = $(raw_e);
    vals[e.attr('name')] = e.val();
  });

  return vals;
};


Edit_able.prototype.edit = function (e) {
  e.preventDefault();

  var me          = this;
  var button      = $(e.target);
  var is_textarea = me.$.hasClass('textarea');
  var label_text  = me.hide_able().find('span.title').text();
  var name        = button.attr('target');

  this.hide_able().hide();

  var input_able = $('<div class="input_able">' +
                     '<div class="label"></div>' +
                     '<div class="buttons">' +
                     '<a class="submit" href="#save">Save</a> ' +
                     '<a class="cancel" href="#cancel">Cancel</a>' +
                     '</div>' +
                     '</div>');

  input_able.find('div.label').text(label_text);

  var val = $.trim( me.hide_able().find('span.value').text());
  if (val === '[none]')
    val = '';

  if (is_textarea) {
    var input = $('<textarea></textarea>');
    input.text(val);
  } else {
    var input = $('<input type="text" value="" />');
    input.attr('value', val);
  }

  input.attr('name', name);
  input_able.find('div.buttons').before(input);
  me.$.append(input_able);

  input_able.find('a.cancel').click(function (e) { me.cancel(e); });
  input_able.find('a.submit').click(function (e) { me.submit(e); });
  input_able.find('a.submit').bind('after_success', function (o) {
    me.find('div.hide_able span.value').text(o.sanitized_data[name]);
    edit_able.removeClass('loading');
    hide_able.show();
    input_able.hide();
  });


};


Edit_able.prototype.submit = function (e) {
  e.preventDefault();
  this.$.find('div.success, div.error').remove();
  var me        = this;
  var button    = $(e.target);
  var edit_able = button.closest('div.edit_able');
  var o         = this.ajax_options();
  edit_able.addClass('loading');
  var timeout = setTimeout(function () {
    $.ajax(o);
  }, 500);

  return {edit_able: edit_able, button: button, timeout: timeout};
};

Edit_able.prototype.ajax_options = function () {
  var me = this;
  var edit_able = this.$;
  var data      = this.vals();
  var action    = data.action;
  delete data.action;
  log(data);

  return { type : 'POST',
    url         : action,
    cache       : false,
    contentType : 'application/json',
    data        : JSON.stringify(data),
    dataType    : 'json',
    success     : function (resp, stat) {
      log(stat);
      if (resp.success)
        button.trigger('after_success', [resp]);
      else
        Edit_able_s.error(button, resp.msg);
    },
    error: function (xhr, textStatus, errThrown) {
      me.error(textStatus + ': ' + (errThrown || "Check internet connection. Either that or OKdoki.com is down.") );
    }
  };

};





