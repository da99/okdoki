
"use strict";

$(function () {
  // Read templates (html) and save for later use.
  Template.html( $('#templates').html() );
});


// ================================================================
// ================== Events ======================================
// ================================================================

create_event('template compiled');


// ================================================================
// ================== Templates ===================================
// ================================================================


var Template = {

  FNS         : {},
  VARS_REGEXP : /\{([^\}]+)\}/g,

  html : function (html) {
    if (html)
      this._html = $(html).wrap('<p/>').parent();
    if (!this._html)
      throw new Error('Template HTML not ready.');
    return this._html;
  },

  read : function (se) {
    var t = Template.html().find(se);
    if (!t.length)
      throw new Error('Template not found: ' + se);
    return outer_html(t);
    return outer_html(t).replace(this.VARS_REGEXP, "<%- $1 %>");
  },

  escape : function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  },

  compile: function (se, data) {
    var txt = this.read(se);
    var me  = this;

    _.each(data, function (v, k) {
      log(k, v, txt, 'done')
      txt = txt.replace( new RegExp(me.escape('{' + k+'}'), 'g'), v);
    });


    var o = $(txt);
    emit('template compiled', {dom: o});
    return o;
  }

}; // === Template




