
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
      this._html = $(html);
    if (!this._html)
      throw new Error('Template HTML not ready.');
    return this._html;
  },

  read : function (se) {
    var t = Template.html().closest(se);
    if (!t)
      throw new Error('Template not found: ' + se);
    return outer_html(t).replace(this.VARS_REGEXP, "<%- $1 %>");
  },

  compile: function (se, data) {
    if (!this.FNS[se])
      this.FNS[se] = _.template(this.read(se));

    var o = $(this.FNS[se](data));
    emit('template compiled', {dom: o});
    return o;
  }

}; // === Template




