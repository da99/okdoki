var pg        = require('okdoki/lib/POSTGRESQL');
var shortid   = require('shortid');
var _         = require('underscore');
var Validator = require('validator').Validator;
var check     = require('validator').check;
var sanitize  = require('validator').sanitize;
var squel       = require('squel');

function rollback(client) {
  return function (err, meta) {
    if (err) {
      client.query('ROLLBACK', function (new_err) {
        client.end();
        throw (new_err || err);
      } );
    };

  };
};

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

function Customer(customer_id, func) {
  this.is_new = true;
  this.sanitized_data = {};
  this.new_data = {};
  if (customer_id) {
    this.read(customer_id, func);
  };
};

Customer.prototype.new = function (vals) {
  if (!this.is_new)
    throw new Error("Object must be new to be new.");
  this.new_data = vals;
  this.validate();
};

Customer.prototype.validate = function (vals) {
  this.validator = new Validator();
  var valid      = this.validator;
  var k          = null;

  if (this.is_new) {

    var keys = "mask_name password ip".split(' ');
    while (keys.length !== 0) {
      k = keys.shift();
      this['new_' + k](this.new_data[k]);
    };

  } else {

    var keys = "email".split(' ');
    while (keys.length !== 0) {
      k = keys.shift();
      if (this.new_data.hasOwnProperty(k))  {
        this['update_' + k](this.new_data[k]);
      }
    };

  };

  this.is_valid = !valid.has_errors();
  this.errors = valid.get_errors();
};

Customer.prototype.new_mask_name = function (v) {
  this.validator.check(this.new_data.mask_name, 'Name must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
}

Customer.prototype.new_password = function (v) {
  this.validator.check(this.new_data.password, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
}

Customer.prototype.new_ip = function (v) {
  this.validator.check(this.new_data.ip, 'IP address is required.').len(5);
}

Customer.prototype.update_email = function (raw_v) {
  var v = raw_v.toString().trim();
  if (v.length === 0)
    this.sanitized_data.email = null;
  else
    this.sanitized_data.email = v;
}

Customer.prototype.create = function (func) {

  var me   = this;
  var done = arguments[1];

  if (!me.is_valid)
    throw new Error("Invalid: " + me.errors.join(' '));

  // var ucs  = punycode.ucs2.decode(this.mask_name).join('');
  var raw_seed = (this.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var mask_id     = shortid.seed(seed).generate();
  var customer_id = shortid.seed(seed).generate();

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var db = new pg.query();
  pg.show_default_owner(function (owner) {

    db.q('CREATE DATABASE "customer-' + customer_id + '" WITH OWNER = "' + owner + '" ENCODING = \'UTF8\' LC_COLLATE = \'en_US.UTF-8\' LC_CTYPE = \'en_US.UTF-8\';');
    db.q('BEGIN;');
    db.q('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, mask_id]);
    db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [mask_id, customer_id, me.new_data.mask_name]);
    db.q('COMMIT;');
    db.on_error(function (err) {
      rollback(db.client)(err);
    });

    db.run_and_then(function (meta) {
      me.is_new      = false;
      me.customer_id = customer_id;

      if (func)
        func(meta);
    });

  });

}

Customer.prototype.read = function (customer_id, func) {

  var me = this;
  var db = new pg.query();
  db.q('SELECT * FROM customers WHERE id = $1', [customer_id]);
  db.run_and_then(function (meta) {

    if (meta.rowCount === 0)
      throw new Error('Customer not found: ' + customer_id);

    if (meta.rowCount != 1)
      throw new Error('Unknown error: read');

    var result     = meta.rows[0];
    me.is_new      = false;
    me.customer_id = result.id;
    me.email       = result.email;

    var name_q = new pg.query('SELECT * FROM screen_names WHERE customer_id = $1', [customer_id]);

    name_q.run_and_then(function (meta) {
      me.screen_names = _.pluck(meta.rows, 'screen_name');
      func(meta);
    });

  });

}

Customer.prototype.update = function (new_vals, func) {
  this.new_data = new_vals;
  var me = this;
  this.validate();
  if (this.is_valid) {
    var sql = squel.update().table('customers').where('id = $1');
    _.each(me.sanitized_data, function (v, k) {
      sql.set(k, v);
    });

    var db = new pg.query(sql.toString(), [me.customer_id]);
    db.run_and_then(function (meta) {
      _.each(me.sanitized_data, function (v, k) {
        me[k] = v;
      });
      func(meta);
    });

  } else {
    throw new Error('Invalid: ' + this.errors.join(' '));
  };
}

exports.Customer = Customer;




