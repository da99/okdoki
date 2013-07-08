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
  create_event('process ' + f.dom_id);
  create_event('success '       + f.dom_id);
  create_event('invalid '       + f.dom_id);
  create_event('error   '       + f.dom_id);

  on_click(f.dom.find('a.cancel'),      _.bind(f.cancel, f));
  on_click(f.dom.find('button.submit'), _.bind(f.submit, f));

  return f;
};


OK_FORM.prototype.cancel = function () {
  this.loaded();
  if ( !emit('cancel ' + this.dom_id) )
    return false;
  return this.make_like_new();
};


OK_FORM.prototype.loaded = function (msg) {

  this.make_like_new();

  if (msg) {
    after(this.dom.find('div.buttons'))
    .draw_or_update('div.errors', msg)
    .show()
    ;
  }

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

  return f;
};


OK_FORM.prototype.submit = function () {
  var f   = this;
  var log = {
    form : f,
    url  : f.attr('action'),
    data : form_to_json(f)
  };

  if (!is_filled(f.dom_id))
    return false;

  if (stopped_emit('before submit ' + f.dom_id))
    return false;

  if (emit('process ' + f.dom_id, log)) {
    // === Show loading feedback. ===
    f.dom.find('div.buttons').hide();

    after(f.dom.find('div.buttons'))
    .draw_or_update('div.loading', 'processing...')
    .show()
    ;
  }

  // === POST it. ===
  post(log.url, log.data, function (err, raw) {

    if (err) {

      log("Form http error: ", f.dom_id, err, raw);

      if (stopped_emit('error ' + f.dom_id, {err: err, raw: raw}))
        return;

      if (_.isNumber(err) && err > 0)
        f.loaded(f.default_err_msg);
      else if (err === true) {
        var o = to_json_result(raw);
        f.loaded(o.msg || "Website not available right now. Try again later.");
      } else
        f.loaded(f.default_err_msg);

      return ;
    }

    var data = (typeof raw === 'string') ? JSON.parse(raw) : raw;

    log("Form results: " + f.dom_id, data.msg);

    // === invalid ===
    if (!data.success) {
      if (stopped_emit('invalid ' + f.dom_id, {data: data, form: f, raw: raw}))
        return;
      loaded(data.msg || f.default_err_msg);
      return;
    }

    // ==== success ====
    if (!data.msg)
      throw new Error("No success message for: " + f.dom_id);

    if (stopped_emit('success ' + f.dom_id))
      return;

    f.reset_to_submit_more();
    after(f.dom.find('div.buttons'))
    .draw_or_update('div.success', data.msg)
    .show();

  }); // === POST it.

}; // === submit



