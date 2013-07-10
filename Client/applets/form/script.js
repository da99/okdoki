"use strict";

// ================================================================
// ================== Form DSL ====================================
// ================================================================


function form(selector) {
  if (arguments.length > 1)
    throw new Error("Unknown arguments: " + arguments[1]);
  var f = OK_FORM.new(selector);
  return f;
}

$(function () {
  $('form').each(function (i, e) {
    form('#' + $(e).attr('id'));
  });
});

// ================================================================
// ================== Form Implementation =========================
// ================================================================


var OK_FORM = function () {};
var FORMS = {};


OK_FORM.new = function (raw_se) {
  var se = $.trim(raw_se);

  if (se.indexOf('#') !== 0 || se.length < 2)
    throw new Error("Invalid dom id: " + se);

  if (FORMS[se])
    throw new Error('Form was duplicated: ' + selector);

  FORMS[se] = true;

  var f          = new OK_FORM;
  f.dom          = $(se);
  f.dom_id = se;
  f.default_err_msg = "Okdoki.com is having some " +
    "trouble processing your request. Try again later in a few minutes.";


  create_event('cancel '        + f.dom_id);
  create_event('before submit ' + f.dom_id);
  create_event('loading ' + f.dom_id);
  create_event('before success '+ f.dom_id);
  create_event('after success ' + f.dom_id);
  create_event('invalid '       + f.dom_id);
  create_event('error   '       + f.dom_id);

  on_click_if_any(f.dom.find('a.cancel'), _.bind(f.cancel, f));
  on_click(f.dom.find('button.submit'),   _.bind(f.submit, f));

  log("Created form: ", f.dom_id);
  return f;
};


OK_FORM.prototype.cancel = function () {
  this.make_like_new();
  if ( !emit('cancel ' + this.dom_id) )
    return false;
  return this.make_like_new();
};

// ================================================================
// ================== Drawing  ====================================
// ================================================================

OK_FORM.prototype.reset_status = function () {
  this.hide_loading();
  this.show_buttons();
  this.hide_error_msg();
  this.hide_success_msg();
  return this;
};

OK_FORM.prototype.show_buttons = function () {
  this.dom.find('div.buttons').show();
  return this;
};

OK_FORM.prototype.hide_buttons = function () {
  this.dom.find('div.buttons').hide();
  return this;
};

OK_FORM.prototype.hide_loading = function () {
  this.dom.find('div.loading').hide();
  return this;
};

OK_FORM.prototype.hide_error_msg = function () {
  this.dom.find('div.error').hide();
  return this;
};

OK_FORM.prototype.hide_success_msg = function () {
  this.dom.find('div.success').hide();
  return this;
};

OK_FORM.prototype.draw_success_msg = function (msg) {
  if (!msg)
    throw new Error("No success message for: " + this.dom_id);

  this.reset_status();

  after(this.dom.find('div.buttons'))
  .draw_or_update('div.success', msg)
  .show();

  return this;
};

OK_FORM.prototype.draw_error_msg = function (msg) {
  msg || (msg = this.default_err_msg);

  this.reset_status();

  after(this.dom.find('div.buttons'))
  .draw_or_update('div.errors', msg)
  .show();

  return this;
};

OK_FORM.prototype.make_like_new = function () {
  var f = this;
  f.reset_to_submit_more();
  f.dom.find('div.success').hide();
  return f;
};


OK_FORM.prototype.reset_to_submit_more = function() {
  var f = this;

  f.dom[0].reset();
  f.dom.find('div.buttons').show();
  f.dom.find('div.loading').hide();
  f.dom.find('div.errors').hide();
  f.show_buttons();

  return f;
};


OK_FORM.prototype.submit = function () {
  var f   = this;
  var meta = {
    form : f,
    url  : f.dom.attr('action'),
    data : form_to_json(f.dom)
  };

  if (!is_filled(f.dom_id))
    return false;

  if (stopped_emit('before submit ' + f.dom_id, meta))
    return false;

  if (emit('loading ' + f.dom_id, meta)) {
    // === Show loading feedback. ===
    f.hide_buttons();
    f.hide_error_msg();
    f.hide_success_msg();

    after(f.dom.find('div.buttons'))
    .draw_or_update('div.loading', 'processing...')
    .show()
    ;
  }

  // === POST it. ===
  post(meta.url, meta.data, function (err, raw) {

    if (err) {

      log("Form http error: ", f.dom_id, err, raw);

      if (stopped_emit('error ' + f.dom_id, {err: err, raw: raw}))
        return;

      if (_.isNumber(err) && err > 0)
        f.draw_error_msg();
      else if (err === true) {
        var o = to_json_result(raw);
        f.draw_error_msg(o.msg || "Website not available right now. Try again later.");
      } else
        f.draw_error_msg();

      return ;
    }

    var data = (typeof raw === 'string') ? JSON.parse(raw) : raw;

    log("Form results: " + f.dom_id, data.msg);

    var meta = {data: data, form: f, raw: raw};

    // === invalid ===
    if (!data.success) {
      if (stopped_emit('invalid ' + f.dom_id, meta))
        return;
      f.draw_error_msg(data.msg);
      return;
    }

    // ==== success ====
    if (emit('before success ' + f.dom_id, meta)) {
      f.reset_to_submit_more();
      f.draw_success_msg(meta.data.msg);
    }

    emit('after success ' + f.dom_id, meta);
  }); // === POST it.

}; // === submit



