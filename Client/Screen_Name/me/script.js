"use strict";


$(function () {

  get('/bots', function (err, result) {
    if (err) {
      log('Error in /bots: ', err);
      return;
    }

    log(result);
  });

}); // ==== jquery on dom ready















