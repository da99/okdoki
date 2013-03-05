
var UID = exports.UID = function () {};
UID.counter = 0;

var to_float = UID.to_float = function (raw) {
  if (raw.replace)
    return parseFloat(raw.replace( /[^0-9]/g, ''));
  else
    return parseFloat(raw) || 1;
};

// From: http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
UID.create = function () {
  return '' + (++UID.counter) + Math.random().toString(36).substring(18 - 3);
};

UID.create_id = function () {
  return '' + (new Date()).getTime() + '-' +  UID.create();
};

