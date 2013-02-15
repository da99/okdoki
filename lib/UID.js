var shortid   = require('shortid');

exports.UID = function () {};

exports.UID.generate_id = function (raw_seed) {
  var seed    = parseFloat((raw_seed + (new Date).getTime()).toString().replace( /[^0-9]/g, ''));
  return shortid.seed(seed).generate();
};


