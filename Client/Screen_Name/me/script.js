"use strict";


$(function () {

  get('/bots/for/' + Screen_Name.screen_name(), function (err, result) {
    if (err) {
      log('Error in /bots: ', err);
      return;
    }

    WWW_Applet.run_these(result.bots);
  });

}); // ==== jquery on dom ready


// ================================================================
// ================== WWW_Applet ==================================
// ================================================================


var WWW_Applet = function () { };

WWW_Applet.run_these = function (list) {
  _.each(list, function (o) {
    log("Running WWW applet: ", o.screen_name)
    WWW_Applet.run(o);
  });
};

WWW_Applet.run = function (o) {
  var a = new WWW_Applet();
  a.applet = o;
  a.run();
};

// ================================================================
// ================== "Instance" Methods ==========================
// ================================================================

WWW_Applet.prototype.run = function () {
  var me = this;
};













