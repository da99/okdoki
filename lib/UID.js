var shortid   = require('shortid');

var UID = exports.UID = function () {};

var to_float = UID.to_float = function (raw) {
  if (raw.replace)
    return parseFloat(raw.replace( /[^0-9]/g, ''));
  else
    return parseFloat(raw) || 1;
};

UID.create = function (raw_seed) {
  var seed    = to_float((raw_seed + (new Date).getTime()));
  return shortid.seed(seed).generate();
};

UID.create_id = function (raw_seed) {
  return [ (new Date()).getTime(), UID.create(raw_seed) ].join('.');
};

