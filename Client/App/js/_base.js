
var is_dev   = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;
var base_url = window.location.href.replace(/\/$/, '');
var App  = _.extend({}, Backbone.Events);

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
  if (!_template_fns_[se])
    _template_fns_[se] = _.template(read_template(se));
  return $(_template_fns_[se](data));
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
  return $(t)
  .wrap('<p>').parent().html()
  .replace(_templ_vars_, "<%= $1 %>");
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

function after(se) {
  var e = $(se);
  var parent = e.parent();

  var meths = {
    draw_if_not_found : function (se, txt) {
      var e_find = parent.find(se);
      if (e_find.length) {
        e_find.text(txt);
        return e_find;
      }

      var pieces = se.split('.');
      var tag = pieces[0];
      var css = pieces[1];
      var new_e = $('<' + tag + ' class="' + css + '"></' + tag + '>' );
      new_e.text(txt);
      log('drawing:', se, txt);
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

function reset_forms(selector) {
  $(selector).find('div.buttons').show();
  $(selector).find('div.loading').hide();
  $(selector).find('div.errors').hide();
  $(selector).find('div.success').hide();
}

function form(selector, func) {
  if (form_meta[selector]) {
    log('Already formed: ', selector);
    return false;
  }

  var loaded = function (msg) {
    reset_forms(selector);

    if (msg) {
      after($(selector).find('div.buttons'))
      .draw_if_not_found('div.errors', msg)
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

    reset_forms(selector);

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
    .draw_if_not_found('div.loading', 'processing...')
    .show()
    ;

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
        .draw_if_not_found('div.success', result.msg)
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
      else
        loaded(err);
      on_e(result);
    };
  };

  e.on_invalid = function (on_i) {
    form_meta[selector].invalid = function (result) {
      loaded();
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

var The_Screen_Name = null;
$(function () {
  var sn = 'div.The_Screen_Name';
  if (template_or_null(sn)) {
    The_Screen_Name = $(read_template(sn)).text();
  }
});


// ================================================================
// ================== Adaptive ====================================
// ================================================================

function add_screen_class () {
  var w = (parseInt($(window).width() / 100) * 100);
  var c = (($('body').attr('class') || '').split(' '));
  _.each(c, function (s) {
    if (s.match(/^w\d+(_plus|_minus)?$/))
      $('body').removeClass(s);
  });
  $('body').addClass('w' + w);
  _.each([400, 500, 600, 700, 800, 900, 1000, 1100, 1200], function (target) {
    if ( w >= target)
      $('body').addClass('w' + target + '_plus');
    if ( w < target)
      $('body').addClass('w' + target + '_minus');
    log(w, target)
  });
  log($('body').attr('class'));
}

$(window).resize(function () {
  add_screen_class();
});

add_screen_class();





