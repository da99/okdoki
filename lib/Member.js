var Validator = require('validator').Validator;
var check     = require('validator').check,
sanitize  = require('validator').sanitize;

Validator.prototype.error = function(msg) {
  this._errors.push(msg);
  return this;
};

Validator.prototype.get_errors = function () {
  return this._errors;
};

Validator.prototype.has_errors = function () {
  return this._errors.length === 0;
};

function Member() {
  this.is_new = true;
};

Member.prototype.new = function (vals) {
  if (!this.is_new)
    throw new Error("Object must be new to be new.");
  var valid = new Validator();
  valid.check(vals.mask_name, 'Name must be 3-10 chars: 0-9 a-z A-Z _ -').is(/^[a-z0-9\-\_]{3,10}$/i);
  valid.check(vals.password, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
  this.is_valid = valid.has_errors(); 
  this.errors = valid.get_errors();
};


exports.Member = Member;
