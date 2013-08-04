var _ = require('underscore')._;
var Canon_SN = require('../../Client/js/Screen_Name').canonize_screen_name;

var S = /\s+/g;

var H = exports.H = {
  preview : function (raw_str) {
    var str = raw_str.trim();
    if (!str)
      return '...';
    if (str.length < 20)
      return str;
    var pieces = str.split(S);
    if (pieces.length < 13)
      return str;
    return pieces.slice(0, 10).join(' ') + '...';
  },

  to_owner_id : function (data) {
    var owner = H.null_if_empty(data.as_this_life);
    if (!owner)
      return null;
    return owner.screen_name_id(owner);
  },

  to_canon_name_sub : function (raw_n) {
    var n = raw_n
    .toLowerCase()
    .replace(Screen_Name.INVALID_CHARS, '')
    .slice(0, 15)
    ;

    return H.null_if_empty(n);
  },

  null_if_empty : function (str) {
    if (!str) return null;
    str = str.trim();
    if (!str.length)
      return null;
    return str;
  },

  is_json : function (str) {
    var is = false;
    try {
      JSON.parse(str);
      is = true;
    } catch (e) {
      is = false;
    }
    return is;
  },

  canonize_screen_name : Canon_SN

};



