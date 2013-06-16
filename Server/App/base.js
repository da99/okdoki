var _ = require('underscore')
;

exports.move_keys = function (target, source) {
  var args = _.flatten(_.toArray(arguments).slice(2));
  _.each(args, function (k) {
    target[k] = source[k];
    delete source[k];
  });

  return [target, source];
};

exports.log = function() {
  var args = _.map(_.toArray(arguments), function (v, i) {
    if (!_.isArray(v))
      return v;
    var arr = v;
    return ((_.isArray(arr) && arr.length > 5) ? 'Array: ' + arr.length : arr);;
  });

  if (process.env.IS_DEV)
    console['log'].apply(console, args);
};

exports.warn = function() {
  var args = _.map(_.toArray(arguments), function (v, i) {
    if (!_.isArray(v))
      return v;
    var arr = v;
    return ((_.isArray(arr) && arr.length > 5) ? 'Array: ' + arr.length : arr);;
  });

  console['log'].apply(console, args);
};

exports.error = function() {
  var args = _.map(_.toArray(arguments), function (v, i) {
    if (!_.isArray(v))
      return v;
    var arr = v;
    return ((_.isArray(arr) && arr.length > 5) ? 'Array: ' + arr.length : arr);;
  });

  console['log'].apply(console, args);
};



