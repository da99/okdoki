var is_dev   = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;
var base_url = window.location.href.replace(/\/$/, '');

var Box = {

  is_dev   : is_dev,
  base_url : base_url,

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

  Box.html($('#Meta_Box').wrap('<p/>').parent().html());

  var sn = Box.read('Screen_Name');
  if (sn)
    Screen_Name.screen_name(sn);

  var c = Box.read('Customer_Screen_Names');
  if (c) {
    Customer.log_in(c.split(/\s+/));
  }
});

