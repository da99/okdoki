
// ================================================================
// ================== DSL =========================================
// ================================================================

var is_dev = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;

var _csrf  = function (obj) {
  if (obj) {
    obj['X-CSRF-Token'] = _csrf();
    obj['_csrf'] = _csrf();
    return obj;
  }
  return $.trim($('#_csrf').text());
}

var log = function (msg) {
  if (is_dev)
    return console.log.apply(console, arguments);

  return null;
};


// ================================================================
// ================== Main Stuff ==================================
// ================================================================

var Box = {

  base_url : window.location.href.replace(/\/$/, ''),

  erase_url_wanted : function () {
    $.removeCookie('url_wanted', {path: '/'});
  },

  html : function (html) {
    if (html)
      this._html = html;
    if (!this._html)
      throw new Error('Meta Box html not found.');
    return this._html;
  },

  read: function (css) {
    var v = $.trim((this.html().find('div.' + css).text() || ''));
    if (!v.length)
      return undefined;
    return v;
  }

};

$(function () {

  // === Grab info about the box.
  Box.html($('#Meta_Box').wrap('<p/>').parent().html());

});




