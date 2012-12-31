var pg_client = require('okdoki/lib/DB').pg_client;
var shortid = require('shortid');

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
  this.new_values = vals;
  this.validate();
};

Member.prototype.validate = function (vals) {
  this.validator = new Validator();
  var valid = this.validator;

  if (this.is_new) {
    var keys = "mask_name password".split(' ');
    var k = null;
    while (keys.length !== 0) {
      k = keys.shift();
      this['new_' + k]();
    };
  } else {
    throw new Error('not ready yet.');
  };

  this.is_valid = valid.has_errors();
  this.errors = valid.get_errors();
};

Member.prototype.new_mask_name = function (v) {
  this.validator.check(this.new_values.mask_name, 'Name must be 3-10 chars: 0-9 a-z A-Z _ -').is(/^[a-z0-9\-\_]{3,10}$/i);
}

Member.prototype.new_password = function (v) {
  this.validator.check(this.new_values.password, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
}

Member.prototype.create = function (func) {

  var seed        = ((this.new_values.ip || '00.00.00.00') + (new Date).getTime()).replace( /[^0-9]/g, '');
  var mask_id     = shortid.seed(seed).generate();
  var customer_id = shortid.seed(seed).generate();
  var me = this;

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  pg_client.query("INSERT INTO customers(id, passphrase_hash) values($1, $2)", [customer_id, mask_id], function (err, meta) {

    if (err)
      throw err;

    if (meta.rowCount != 1)
      throw new Error('Unknown error: create');

    var result       = meta.rows;
    me.is_new      = false;
    me.customer_id = customer_id;

    if (func)
      func(me, result);

  });
}

Member.prototype.read = function (customer_id, func) {
  var me = this;
  pg_client.query('SELECT * FROM customers WHERE id = $1', [customer_id], function (err, meta) {
    if (err)
      throw err;

    if (meta.rowCount === 0)
      throw new Error('Customer not found: ' + customer_id);

    if (meta.rowCount != 1)
      throw new Error('Unknown error: read');

    var result = meta.rows[0];
    me.is_new = false;
    me.customer_id = result.id;
    me.email = result.email;

    if (func)
      func(me, meta);
  });
}


exports.Member = Member;




