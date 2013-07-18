Event.create('template compiled');


// ================================================================
// ================== Templates ===================================
// ================================================================


var Template = {

  FNS         : {},
  VARS_REGEXP : /\{([^\}]+)\}/g,

  html : function (html) {
    if (html)
      this._html = html;
    if (!this._html)
      throw new Error('Template HTML not ready.');
    return this._html;
  },

  read : function (se) {
    var t = Template.html().find(se);
    if (!t)
      throw new Error('Template not found: ' + se);
    return $(t).wrap('<p/>').parent().html().replace(this.VARS_REGEXP, "<%- $1 %>");
  },

  compile: function (se, data) {
    if (!this.FNS[se])
      this.FNS[se] = _.template(this.read_template(se));

    var o = $(this.FNS[se](data));
    emit('template compiled', {selector: o});
    return o;
  }

}; // === Template

$(function () {
  // Read templates (html) and save for later use.
  Template.html( $($($('#templates').html()).wrap('<p/>').parent().html()) );
});


