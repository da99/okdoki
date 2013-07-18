

var COMMON_NS = {
  ALL_WHITE_SPACE : /\s+/g,
  BEGIN_AT_OR_HASH : /^(@|#)/
};

function canonize_screen_name (str) {
  if (!str)
    return str;

  if (str.trim)
    str = str.trim();
  else
    str = $.trim(str);

  return str.toUpperCase().replace(COMMON_NS.BEGIN_AT_OR_HASH, '').replace(COMMON_NS.ALL_WHITE_SPACE, '-');

}


if (typeof exports !== 'undefined') {
  exports.canonize_screen_name = canonize_screen_name;
}

// =======================================================================================

var ALL_WHITE_SPACE = /\s+/g;
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










