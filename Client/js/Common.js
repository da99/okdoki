
var ALL_WHITE_SPACE  = /\s+/g;
var BEGIN_AT_OR_HASH = /^(@|#)/;



if (typeof exports !== 'undefined') {
  exports.canonize_screen_name = canonize_screen_name;
}

// =======================================================================================

var do_nothing = function() {};

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


// ================== On Load =====================================
$('select[name="as_this_life"]').each(function (i, e) {
  var opts = $(e).find('option');
  if (opts.length > 1)
    $(e).parent('span.as_this_life').show();
});


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

function is_filled(se) {
  var form = $(se);
  var inputs = form.find('input[type="text"], textarea');
  if (inputs.length < 1)
    return true;
  var i = _.find(inputs, function (e) {
    return $.trim($(e).val()).length > 0;
  });

  return !!i;
}

function on_click_if_any(se, func) {
  if ($(se).length)
    return on_click(se, func);
  return;
}

function on_click(selector, func) {
  var e = $(selector);
  if (!e.length) {
    log("None found for: ", selector.selector || selector);
  }

  e.click(function (ev) {
    ev.stopPropagation();
    ev.preventDefault();

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


