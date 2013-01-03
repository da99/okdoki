var pg        = require('okdoki/lib/POSTGRESQL');
var shortid    = require('shortid')
, _            = require('underscore')
, check        = pg.check
, Validator    = pg.Validator
, sanitize     = pg.sanitize
, rollback     = pg.rollback
, Screen_names = require('okdoki/lib/Screen_names').Screen_names;

function Customer(new_vals) {
  this.is_new         = true;
  this.data           = {};
  this.sanitized_data = {};
  this.new_data       = {};
  this.Screen_names   = new Screen_names(this);

  if (new_vals) {
    this.new_data = new_vals;
    this.validate();
  }

}

Customer.prototype.validate = function (vals) {
  this.validator = new Validator();
  var valid      = this.validator;
  var k          = null;

  if (this.is_new) {

    var keys = "password ip".split(' ');
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

  this.Screen_names.validate();
  this.is_valid = !valid.has_errors();
  this.errors = valid.get_errors();
};


Customer.prototype.new_password = function (v) {
  this.validator.check(v, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
}

Customer.prototype.new_ip = function (v) {
  this.validator.check(v, 'IP address is required.').len(5);
}

Customer.prototype.update_email = function (raw_v) {
  var v = raw_v.toString().trim();
  if (v.length === 0)
    this.sanitized_data.email = null;
  else
    this.sanitized_data.email = v;
}

Customer.create = function (new_vals, on_fin, on_err) {
  var mem = new Customer(new_vals);
  if (!mem.is_valid) {
    on_err(mem);
    return mem;
  }

  return mem.create(on_fin, on_err);
};

Customer.prototype.create = function (func, on_err) {

  var me   = this;
  var done = arguments[1];

  if (!me.is_valid)
    throw new Error("Invalid: " + me.errors.join(' '));

  // var ucs  = punycode.ucs2.decode(this.mask_name).join('');
  var raw_seed = (this.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var mask_id     = shortid.seed(seed).generate();
  var customer_id = shortid.seed(seed).generate();
  this.sanitized_data.id = customer_id;
  this.sanitized_data.seed = seed;

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var db = new pg.query();
  pg.show_default_owner(function (owner) {

    db.q('CREATE DATABASE "customer-' + customer_id + '" WITH OWNER = "' + owner + '" ENCODING = \'UTF8\' LC_COLLATE = \'en_US.UTF-8\' LC_CTYPE = \'en_US.UTF-8\';');
    db.q('BEGIN;');
    db.q('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, mask_id]);
    me.Screen_names.create(db);
    db.q('COMMIT;');
    db.on_error(function (err) {
      rollback(db.client)(err);
    });

    db.run_and_then(function (meta) {
      me.is_new      = false;
      me.customer_id = customer_id;
      me.data.id = customer_id;
      me.Screen_names.after_create();

      if (func)
        func(me, meta);
    });

  });

  return this;
};

Customer.read = function (id, on_fin, on_err) {
  var mem = new Customer();
  return mem.read(id, on_fin, on_err);
};

Customer.prototype.read = function (customer_id, func, on_err) {

  var me = this;
  var db = new pg.query();
  db.q('SELECT * FROM customers WHERE id = $1', [customer_id]);
  db.run_and_then(function (meta) {

    if (meta.rowCount === 0) {
      if (on_err)
        return on_err(meta);
      else
        throw new Error('Customer not found: ' + customer_id);
    }

    if (meta.rowCount != 1)
      throw new Error('Unknown error: read');

    var result     = meta.rows[0];
    me.is_new      = false;
    me.customer_id = result.id;
    me.data.id     = customer_id;
    me.data.email  = result.email;

    Screen_names.read(me, function () {
      if (func)
        func(me, meta);
    });

  });

  return me;
};

Customer.prototype.update = function (new_vals, func) {
  this.new_data = new_vals;
  var me        = this;
  this.validate();

  if (!this.is_valid)
    throw new Error('Invalid: ' + this.errors.join(' '));

  var sql_vals = {};
  _.each(me.sanitized_data, function (v, k) {
    if (k == 'email') {
      sql_vals[k] = v;
    }
  });
  var sql = pg.sql_gen.update('customers', {id: me.customer_id}, sql_vals)

  var db = new pg.query();
  db.q('BEGIN;');
  if (!_.isEmpty(sql_vals))
    db.q(sql.sql, sql.values);
  me.Screen_names.update(db);
  db.q('COMMIT;');

  db.on_error(function (err) {
    rollback(db.client)(err);
  });
  db.run_and_then(function (meta) {
    func(meta);
  });

};

exports.Customer = Customer;




