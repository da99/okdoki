var valid     = require('validator');
var Validator = exports.Validator = valid.Validator;
var check     = exports.check     = valid.check;
var sanitize  = exports.sanitize  = valid.sanitize;

Validator.prototype.error = function(msg) {
  this._errors.push(msg);
  return this;
};

Validator.prototype.get_errors = function () {
  return (this._errors || []);
};

Validator.prototype.has_errors = function () {
  if (!this._errors)
    return false;
  return this._errors.length !== 0;
};

