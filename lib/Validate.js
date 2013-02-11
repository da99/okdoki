var _ = require('underscore')
;

var Validate = exports.Validate = function (name, init) {
  this.name = name;
  this.trim_all = true;
  this.is_valid = true;
  this.validations = {};
  if (init)
    init(this);
};

var V = Validate;

V.new = function (name, init) {
  var v = new V(name, init);
  return v;
};

V.prototype.define = function(name, func) {
  var me = this;
  if (me.validations[name])
    throw new Error(name + ' already defined.');

  me.validations[name] = func;

  return me;
};

V.prototype.validate = function (target) {
  var me = this;
  if (!target.sanitized_data)
    target.sanitized_data = {};

  _.find(me.validations, function (func, k) {
    var v = Validation.new(me, k, target);
    func(v);
    return !v.is_valid;
  });

  return me.is_valid;
};


var Validation = function (validate, key, target) {
  var me      = this;
  me.validate = validate;
  me.key      = key;
  me.english_key = (key).replace(/_/g, ' ');
  me.target   = target;
  me.val      = target.new_data[key];
  me.is_valid = true;

  if (me.validate.trim_all && me.val && me.val.trim)
    me.sanitized(me.val.trim());
};

Validation.new = function (v, k, t) {
  var v = new Validation(v, k, t);
  return v;
};

Validation.prototype.sanitized = function (v) {
  var me = this;
  me.val = me.target.sanitized_data[me.key] = v;
  return v;
};

Validation.define = function (name, func) {
  Validation.prototype[name] = function () {
    var me = this;
    if (!me.validate.is_valid)
      return me;

    var args = _.toArray(arguments);
    var result = func.apply(me, args);

    if (result[0]) {
      me.sanitized(result[1]);
      return me;
    }

    me.validate.is_valid  = false;
    me.validate.error_msg = me.target.errors = result[1];

    return me;
  };
};

Validation.define('at_least', function (n, msg) {
  var me = this;

  if (me.val &&
      me.val.length &&
        me.val.length >= n)
    return [true, me.val];

  msg = msg || me.english_key + (' must be at least: ' + n);
  return [false, msg];
});

Validation.define('at_most', function (n, msg) {
  var me = this;

  if (me.val &&
      me.val.length &&
        me.val.length <= n)
    return [true, me.val];

  msg = msg || me.english_key + (' can not be more than: ' + n);
  return [false, msg];
});

Validation.define('between', function (min, max, msg) {
  var me = this;
  msg = msg || me.english_key + ' must be between: ' + min + ' and ' + max;

  me
  .at_least(min, msg)
  .at_most(max, msg);

  if(me.is_valid)
    return [true, me.val];
  return [false, msg];

});


Validation.define('at_least_2_words', function (msg) {
  var me = this;
  var v = (me.val || '').trim();

  if(v.indexOf(' ') > 0)
    return [true, v];

  msg = msg || me.english_key + ' must be two words or more.';
  return [false, msg];

});

Validation.define('equal', function (v, msg) {
  var me = this;
  msg = msg || me.english_key + ' must equal: ' + v;
  if (v !== me.val)
    return [false, msg];
  return [true, v];
});
Validation.define('not_empty', function (msg) {
  var me = this;
  msg = msg || me.english_key + ' must not be empty.';
  if (_.isArray(me.val)) {
    var v = _.compact(me.val);
  } else {
    var v = (me.val || '').trim();
  };

  if (v.length > 0)
    return [true, v];
  return [false, msg];
});










