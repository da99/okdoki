
$(function () {
  var sn = Box.read('Screen_Name');
  if (sn)
    Screen_Name.screen_name(sn);
});

function canonize_screen_name (str) {
  if (!str)
    return str;

  if (str.trim)
    str = str.trim();
  else
    str = $.trim(str);

  return str.toUpperCase().replace(BEGIN_AT_OR_HASH, '').replace(ALL_WHITE_SPACE, '-');

}

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

if (typeof exports === 'undefined') {

  // ================== On Load =====================================
  $('select[name="as_this_life"]').each(function (i, e) {
    var opts = $(e).find('option');
    if (opts.length > 1)
      $(e).parent('span.as_this_life').show();
  });

} else {

  exports.canonize_screen_name = canonize_screen_name;

};

