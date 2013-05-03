
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
// ================== Templates ===================================
// ================================================================

function pull_template(se) {
  return $($('#templates').html()).closest(se);
}

function create_unless(se) {
  var e = $(se);
  if (!e.length) {
    return {'in': function (target, func) {
      log('Drawing: ' + se);
      $(target).append(pull_template(se));
      if (func)
        func($(target));
    }};
  }

  return {'in': do_nothing};
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
    return console.log(msg);

  return null;
};

function func() {
  return _.partial.apply(_, arguments);
}

// ================================================================
// ================== DSL =========================================
// ================================================================

var form_meta = {};

function form(selector, func) {
  if (!form_meta[selector]) {
    form_meta[selector] = {
      error: function (err, result) {
        log("http error:", err, result);
      },
      success: function (result) {
        log("success: ", result);
      },
      invalid: function (result) {
        log('invalid: ', result);
      }
    };

    $(selector).find('button.submit').click(function (e) {
      e.stopPropagation();

      var form = $($(this).closest('form'));
      var url = form.attr('action');
      var data = form_to_json(form);
      var headers = {
        'X-CSRF-Token': _csrf(),
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
      };
      post(url, data, headers, function (err, raw) {
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
  }

  var e = $(selector);

  e.on_success = function (on_s) {
    form_meta[selector].success = function (result) {
      on_s(result);
    };
  };

  e.on_error = function (on_e) {
    form_meta[selector].error = function (err, result) {
      on_e(result);
    };
  };

  e.on_invalid = function (on_i) {
    form_meta[selector].invalid = function (result) {
      on_i(result);
    };
  }

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


// ==========================================================
// Example:
//
//   post(url, data, [headers], function ([err], result) {});
//
// ==========================================================
function post() {
  var args = _.toArray(arguments);
  var func = args.pop();
  var new_func = function (err, results) {
    if (func.length === 2) {
      func(err, results);
    } else {
      if (err)
        log(err);
      else
        func(results);
      return;
    }
  };
  var prom = promise.post.apply(promise, args);
  return prom.then(new_func);
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

// ****************************************************************
// ****************** Forms ***************************************
// ****************************************************************

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











