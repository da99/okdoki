"use strict";

var OK_FORM = function () {};
var FORMS = {};


OK_FORM.new = function (raw_se) {
  var se = $.trim(se);
  if (se.indexOf('#') !== 0)
    throw new Error("Invalid dom id: " + se);
  if (FORMs[se])
    throw new Error('Form was duplicated: ' + selector);
  FORMS[se] = true;

  var f          = new OK_FORM;
  f.funcs        = {};
  f.dom          = $(se);
  f.original_dom = se;
  f.default_err_msg = "Okdoki.com is having some " +
    "trouble processing your request. Try again later in a few minutes.";


  create_event('cancel '        + f.original_dom);
  create_event('before submit ' + f.original_dom);
  create_event('success '       + f.original_dom);
  create_event('invalid '       + f.original_dom);
  create_event('error   '       + f.original_dom);

  on_click(f.dom.find('a.cancel'),      _.bind(f.cancel, f));
  on_click(f.dom.find('button.submit'), _.bind(f.submit, f));

  return f;
};


OK_FORM.prototype.cancel = function () {
  this.loaded();
  if ( !emit('cancel ' + this.original_dom) )
    return false;
  return this.make_like_new();
};

OK_FORM.prototype.click_submit = function () {

};

OK_FORM.prototype.submit = function () {
  var f       = this;
  var url     = f.attr('action');
  var data    = form_to_json(f);

  var log = {form: f, url: url, data: data };

  if (!emit('before submit ' + f.original_dom, log))
    return false;

  after submit f.make_like_new();
  if (!form_meta[selector].only_if(form))
    return false;

  if (form_meta[selector].at_least_one_not_empty) {
    var ls = _.uniq(_.map(form_meta[selector].at_least_one_not_empty, function (v) {
      return $.trim(form.find(v).val()).length > 0;
    }));
    if (!_.contains(ls, true))
      return false;
  }

  $(selector).find('div.buttons').hide();

  after($(selector).find('div.buttons'))
  .draw_or_update('div.loading', 'processing...')
  .show()
  ;

  var deny_it = false;
  var log = {form: f, url: url, data: data, deny: function () { deny_it = true; } };
  emit("before submit " + f.original_dom, log);

  if (deny_it)
    return false;

  post(log.url, log.data, function (err, raw) {
    if (err) {
      form_meta[selector].error(err, raw);
    } else  {
      var data = (typeof raw === 'string') ? JSON.parse(raw) : raw;
      if (data.success)
        form_meta[selector].success(data);
      else
        form_meta[selector].invalid(data);
    }
  });

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
  this.find('div.buttons').show();
  this.find('div.loading').hide();
  this.find('div.errors').hide();
  this.find('div.success').hide();
  return this;
};

OK_FORM.prototype.reset_to_submit_more = function() {
  this.find('div.buttons').show();
  this.find('div.loading').hide();
  this.find('div.errors').hide();

  return this;
}



// ================================================================
// ================== Form DSL ====================================
// ================================================================


function form(selector) {
  if (arguments.length > 1)
    throw new Error("Unknown arguments: " + arguments[1]);

  var f = OK_FORM.new(selector);
  return f;

  // ==========================================
  var e = $(selector);


  e.at_least_one_not_empty = function () {
    form_meta[selector].at_least_one_not_empty = _.toArray(arguments);
  };

  e.on_success = function (on_s) {
    form_meta[selector].success = function (result) {
      loaded();
      var form = $($(selector))[0];
      form && form.reset();
      if (result.msg) {
        log(result.msg)
        after($(selector).find('div.buttons'))
        .draw_or_update('div.success', result.msg)
        .show();
        $(selector).find('div.success').text(result.msg);
      }
      on_s(result);
    };
  };

  e.on_error = function (on_e) {
    form_meta[selector].error = function (err, result) {
      if (_.isNumber(err) && err > 0)
        loaded(default_err);
      else if (err === true) {
        var o = to_json_result(result);
        loaded(o.msg || "Website not available right now. Try again later.");
      } else
        loaded(err);
      on_e(result, err);
    };
  };

  e.on_invalid = function (on_i) {
    form_meta[selector].invalid = function (result) {
      loaded();
      var msg = null;
      loaded(result.msg || default_err);
      on_i(result);
    };
  }

  //
  // default handlers
  //
  e.only_if(function () { return true; });

  e.on_error(function (err, result) {
    log("http error:", err, result);
  });

  e.on_success(function (result) {
    log("success: ", result);
  });

  e.on_invalid(function (result) {
    log('invalid: ', result);
  });

  // Add custom handlers.
  func(e);

  return e;
}

