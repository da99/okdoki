
var is_dev   = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;
var base_url = window.location.href.replace(/\/$/, '');
var App  = _.extend({}, Backbone.Events);
var Screen_Name = {
  is_found : false,
  screen_name: function (sn) {
    if (sn) {
      this._sn = sn;
      this.is_found = !!this._sn;
    }
    return this._sn;
  },
  to_url : function (path) {
    var url = "/me/" + this._sn;
    if (path)
      url += path;
    return url;
  }
};
var Customer    = {
  is_stranger : true,
  is_customer : false,
  is_owner_of_screen_name: false,
  has_one_life : false,
  fav_screen_name : function (n) {
    if (n)
      this._fav = n;
    return this._fav;
  },
  _sns : [],
  screen_names : function (arr) {
    if (arr) {
      this._sns = arr;
      this.is_stranger = false;
      this.is_customer = !this.is_stranger;
      this.has_one_life = this._sns.length === 1;
      this.is_owner_of_screen_name = Screen_Name.is_found && _.detect(arr, function (n) {
        return Screen_Name.screen_name().toUpperCase() == n.toUpperCase() ;
      });
      this.fav_screen_name( _.last(arr) );
    }

    return this._sns;
  },
  log_in : function (arr) {
    this.screen_names(arr);
  }
};

App.on('all', function (name) {
  log("event: " + name);
});

function do_nothing() { }

function trigger() {
  return App.trigger.apply(App, arguments);
}

function on() {
  return App.on.apply(App, arguments);
}

function log_length(se, orig) {
  var e = $(se);
  if (!e.length)
    log('None found for: ' + (orig || se));
  return e;
}

function show(se) {
  return log_length(se).show();
}

function hide(se) {
  return log_length(se).hide();
}

// ================================================================
// ================== Events ======================================
// ================================================================

function ensure_event_created(name) {
  if (!create_event.names[name])
    throw new Error('Event not created: ' + name);
}

function create_event(name) {
  if (!create_event.names)
    create_event.names = {};
  if (create_event.names[name])
    throw new Error('Event already created: ' + name);
  create_event.names[name] = [];
  return create_event.names[name];
}

function on(name, func) {
  ensure_event_created(name);
  create_event.names[name].push(func);
}

function emit(name, raw_args) {
  ensure_event_created(name);
  var args = _.toArray(arguments);
  args.shift();
  _.each(create_event.names[name], function (f) {
    f.apply(null, args);
  });
}

function describe_event(name) {
  ensure_event_created(name);
  return create_event.names[name];
}

// ================================================================
// ================== Session =====================================
// ================================================================


$(function () {
  var sn = 'div.Screen_Name';
  if (template_or_null(sn)) {
    Screen_Name.screen_name($(read_template(sn)).text());
  }
  var c = 'div.Customer_Screen_Names';
  if (template_or_null(c)) {
    Customer.log_in($.trim($(read_template(c)).text()).split(/\s+/));
  }
});

function erase_url_wanted() {
  $.removeCookie('url_wanted', {path: '/'});
}



// ================================================================
// ================== Time ========================================
// ================================================================

// Modified From: http://stackoverflow.com/questions/6637574/how-to-format-now-with-jquery
function time_for_humans(t) {
  var now = (new Date).getTime();
  var diff = (now - t);

  if (diff < 5000) {
    return "a few seconds ago";
  }

  var vals = [
    [(diff / 1000 / 60 / 60 / 24), 'day'],
    [(diff / 1000 / 60 / 60)     , 'hr'],
    [(diff / 1000 / 60)          , 'min'],
    [(diff / 1000)               , 'sec'],
  ];

  var highest = _.detect(vals, function (pair) {
    return parseInt(pair[0]) > 0;
  }) || [0, 'sec'];

  highest[0] = parseInt(highest[0]);
  highest.push('ago');

  if (highest[0] > 1)
    highest[1] = highest[1] + 's';

  if (highest[0] < 1)
    highest[0] = "<1";

  return highest.join(' ');

}

function in_secs(num, func) {
  setTimeout(func, num * 1000);
}

function every_secs(num, func) {
  setInterval(func, num * 1000);
}

// ================================================================
// ================== Templates ===================================
// ================================================================

var _template_fns_ = {};
var _templ_vars_ = /\{([^\}]+)\}/g;

function compile_template(se, data) {
  if (!_template_fns_[se]) {
    _template_fns_[se] = _.template(template_or_default(se, data));
  }
  return $(_template_fns_[se](data));
}

function template_or_default(se, data) {
  var temp = read_template(se);
  if (!temp) {
    log("Templated not found: " + se);
    var html = '<div class="template_not_found">' + _.map(_.keys(data), function (v) {
      return '{' + v + '} <br />';
    }).join("") + '</div>';
    temp = template_to_underscore(html);
  }
  return temp;
}

function template_or_null(se) {
  var t = $($('#templates').html()).closest(se);
  if (!t.length)
    return null;
  return t;
}

function read_template(se) {
  var t = template_or_null(se);
  if (!t)
    return t;
  return template_to_underscore( $(t).wrap('<p>').parent().html() );
}

function template_to_underscore(html) {
  return html.replace(_templ_vars_, "<%= $1 %>");
}

function create_unless(se) {
  var e = $(se);
  if (!e.length) {
    return {'in': function (target, func) {
      log('Drawing: ' + se);
      $(target).prepend(pull_template(se));
      if (func)
        func($(target));
    }};
  }

  return {'in': do_nothing};
}

// ============================================
// Note:
// Selector for .draw_or_update
//   must be in the form of: TAG.class
// ============================================
function after(se) {
  var e = $(se);
  var parent = e.parent();

  var meths = {
    draw_or_update : function (se, txt) {
      var pieces = se.split('.');
      var tag = pieces[0];
      var css = pieces[1];
      var new_e = $('<' + tag + '></' + tag + '>' );
      if(css)
        new_e.addClass(css);
      new_e.append(add_okdoki_link(txt));
      log('drawing:', se, txt);

      // Remove previous. if any:
      parent.find(se).remove();
      e.after(new_e);

      return new_e;
    }
  };

  if (!e.length) {
    log('Not found: ', se);
    _.each(meths, function (v, k) {
      meths[k] = do_nothing;
    });
  }

  return meths;
}

// ================================================================
// ================== Etc. ========================================
// ================================================================


function _csrf(obj) {
  if (obj) {
    obj['X-CSRF-Token'] = _csrf();
    obj['_csrf'] = _csrf();
    return obj;
  }
  return $.trim($('#_csrf').text());
}

function log(msg) {
  if (is_dev)
    return console.log.apply(console, arguments);

  return null;
};

function func() {
  return _.partial.apply(_, arguments);
}

// ================================================================
// ================== DSL =========================================
// ================================================================

var form_meta = {};

function make_form_like_new(se) {
  $(se).find('div.buttons').show();
  $(se).find('div.loading').hide();
  $(se).find('div.errors').hide();
  $(se).find('div.success').hide();
}

function reset_form_to_submit_more(se) {
  $(se).find('div.buttons').show();
  $(se).find('div.loading').hide();
  $(se).find('div.errors').hide();
}

function form(selector, func) {
  if (form_meta[selector]) {
    log('Already formed: ', selector);
    return false;
  }

  var loaded = function (msg) {
    make_form_like_new(selector);

    if (msg) {
      after($(selector).find('div.buttons'))
      .draw_or_update('div.errors', msg)
      .show()
      ;
    }
  };

  form_meta[selector] = {};

  $(selector).find('a.cancel').click(function (e) {
    loaded();
    return false;
  });

  $(selector).find('button.submit').click(function (e) {
    e.stopPropagation();

    make_form_like_new(selector);

    var form    = $($(this).closest('form'));
    var url     = form.attr('action');
    var data    = form_to_json(form);

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

    if (form_meta[selector].before)
      form_meta[selector].before(url, data);

    post(url, data, function (err, raw) {
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

    return false;
  });

  var e = $(selector);
  var default_err = "Okdoki.com is having some trouble processing your request. Try again later in a few minutes.";

  e.only_if = function (func) {
    form_meta[selector].only_if = func;
  };

  e.on_before_send = function (on_before) {
    form_meta[selector].before = on_before;
  };

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

function on_click(selector, func) {
  var e = $(selector);
  if (!e.length) {
    log("None found for: " + selector);
  }

  e.click(function (ev) {
    func.apply(this, arguments);
    return false;
  });

  return e;
}

function swap_display(show, hide) {
  var s = $(show);
  var h = $(hide);
  if (s.is(':visible')) {
    s.hide();
    h.show();
  } else {
    s.show();
    h.hide();
  };
}

function toggles(show, hide) {
  var target = $($(show).attr('href'));
  var origin = $(show).parents('div.show');
  on_click(show, function (e) {
    target.show();
    origin.hide();
    return false;
  });

  on_click(hide, function (e) {
    target.hide();
    origin.show();
    return false;
  });
}

function json_then(func) {
  return function (err, results) {
    if (!err && typeof(results) === 'string')
      results = JSON.parse(results);

    if (func.length === 2) {
      func(err, results);
    } else {
      if (err)
        log(err);
      else {
        func(JSON.parse(results));
      }
      return;
    }
  };
}

// ==========================================================
// Example:
//
//   post(url, [data], function ([err], result) {});
//
// ==========================================================
function post() {
  var args = _.toArray(arguments);
  var func = args.pop();

  if (args.length === 1) {
    args.push({});
  }

  if (args.length === 2) {
    args.push({
      'X-CSRF-Token': _csrf(),
      'Accept': 'application/json'
      // 'Accept-Charset': 'utf-8'
    });
  }

  var prom = promise.post.apply(promise, args);
  return prom.then(json_then(func));
}

// ==========================================================
// Example:
//
//   get(url, function ([err], result) {});
//
// ==========================================================
function get(url, func) {
  return promise.get(url).then(json_then(func));
}

function form_to_json(selector) {
  var e = $(selector).closest('form');
  if (!e.length) {
    log("No form found for: " + selector);
    return;
  }
  return _csrf( $(e).serializeJSON() );
}

// ================================================================
// ================== Old Code ====================================
// ================================================================


function List() {}

List.new = function (arr, ele, funcs) {
  var a   = new List;
  var me  = a;
  a.list  = [];
  a.funcs = funcs;
  a.html  = $(ele).html();
  a.ele   = ele;
  $(ele).empty();
  _.each(arr, function (piece) {
    console.log(piece);
    me.push(piece);
  });
  return a;
};

List.prototype.push = function (e) {
  this.list.push(e);
  $(this.ele).append(this.html);
};

function Listenize(html, funcs) {
  var eles = $(html);

  eles.find('input[publish-to]').each(function (i, el) {
    var target = $(el).attr('publish-to');
    var parent = $($(el).parents('div[id]')[0]);
    $(el).on('keyup', function (e) {
      parent.find(target).text($(this).val());
    });
  });

  eles.find('button[on-click]').each(function (i, el) {
    var func = $(el).attr('on-click');
    console.log(func)
    $(el).click(funcs[func]);
    return false;
  });

  eles.find('ul[list], div[list]').each(function (i, el) {
    var list = List.new( funcs[$(el).attr('list')], el, funcs );
  });

  return eles;
}

// ================================================================
// ================== Forms =======================================
// ================================================================

function submit(e) {
  var form = $(this).parents('form');
  var id = $(form).attr('id');
  try {
  App.trigger('submit:' + id, {id: id});
  } catch (e) {
    log(e);
  }
  return false;
}


// ================================================================
// ================== Time ========================================
// ================================================================

function min_sec(v) {
  var min = parseInt(v/1000/60);
  var sec = parseInt( (v - (min * 1000 * 60)) / 1000 );
  return min + ':' + ((sec < 10) ? '0' + sec : sec);
}

function every_sec(se, func) {
  var start = (new Date).getTime();
  var update = function () {
    var target = $(se);
    if (!target.length)
      return;
    if( func(target, (new Date).getTime() - start ) )
      setTimeout(update, 1000);
  };

  update();
};

// ================================================================
// ================== Adaptive ====================================
// ================================================================

function add_screen_class () {
  var targets = $('html, body');
  var w       = (parseInt($(window).width() / 100) * 100);
  var c       = ((targets.attr('class') || '').split(' '));

  _.each(c, function (s) {
    if (s.match(/^w\d+(_plus|_minus)?$/))
      targets.removeClass(s);
  });

  targets.addClass('w' + w);
  _.each([400, 500, 600, 700, 800, 900, 1000, 1100, 1200], function (target) {
    if ( w >= target)
      targets.addClass('w' + target + '_plus');
    if ( w < target)
      targets.addClass('w' + target + '_minus');
  });

  log(targets.attr('class'));
}

$(function () {
  $(window).resize(function () {
    add_screen_class();
  });

  add_screen_class();

  $(window).load(function () {
    _.each([300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200], function (v) {
      $('html').addClass('max_' + screen.width );
      if (screen.width > v) {
        $('html').addClass('max_' + v + '_plus');
      }
    });
  });
});


// ================================================================
// ================== Miscell. ====================================
// ================================================================
function add_okdoki_link(str) {
  return _.map(str.split(/\!(okdoki|br)/g), function (p, i) {
    if (p==='okdoki') {
      var e = $('<a></a>');
      e.text('okdoki.com');
      e.attr('href', '/');
    } else if (p === 'br') {
      var e = $('<br />');
    } else {
      var e = $('<span></span>');
      e.text(p);
    };
    return e
  });
}

// from:http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try 
function to_json_result(raw_text) {
  var text  = "" + raw_text;
  var fails = {success: false};
  var o     = null;
  if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                           replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                           replace( /(?:^|:|,)(?:\s*\[)+/g , ''))
                                   ) {
                                   try {
                                   o = JSON.parse(text);
                                   } catch(e) {
                                   o = null;
                                   }

                                   }
    if (!o)
      return fails;
    if (!_.isObject(o))
       return fails;
    return o;
  }


