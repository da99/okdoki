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

Customer.prototype.must_be_valid = function () {
  this.validate();

  if (!this.is_valid)
    throw new Error('Invalid: ' + this.errors.join(' '));

  return true;
};

Customer.prototype.validate = function (vals) {
  this.validator = new Validator();
  var valid      = this.validator;
  var k          = null;

  if (this.is_new) {

    var keys = "password ip screen_name".split(' ');
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

    if (this.new_data.hasOwnProperty('old_screen_name')) {
      this['update_screen_name'](this.new_data.old_screen_name, this.new_data.new_screen_name);
    }

  };

  this.Screen_names.validate();
  this.is_valid = !valid.has_errors();
  this.errors = valid.get_errors();
};

Customer.prototype.new_password = function (v) {
  this.validator.check(v, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
};

Customer.prototype.new_ip = function (v) {
  this.validator.check(v, 'IP address is required.').len(5);
  this.push_sanitized_data('ip', v);
};

Customer.prototype.new_screen_name = function (val) {
  this.validator.check(val, 'Name must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
  this.push_sanitized_data('screen_name', val);
};

Customer.prototype.update_screen_name = function (o, n) {
  this.push_sanitized_data('screen_name_id', this.Screen_names.to_id(o));
  this.new_screen_name(n);
};

Customer.prototype.update_email = function (raw_v) {
  var v = raw_v.toString().trim();
  if (v.length === 0)
    this.sanitized_data.email = null;
  else
    this.sanitized_data.email = v;
};

Customer.prototype.push_sanitized_data = function (k, val) {
  if (!this.validator.has_errors()) {
    this.sanitized_data[k] = val;
  }
};

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

  // var ucs  = punycode.ucs2.decode(this.screen_name).join('');
  var raw_seed = (this.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var screen_name_id = shortid.seed(seed).generate();
  var customer_id    = shortid.seed(seed).generate();
  var screen_name    = this.sanitized_data.screen_name;

  this.sanitized_data.id             = customer_id;
  this.sanitized_data.seed           = seed;
  this.sanitized_data.screen_name_id = screen_name_id;

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var db = new pg.query();
  pg.show_default_owner(function (owner) {

    db.q('BEGIN;');
    db.q('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, screen_name_id]);
    db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [screen_name_id, customer_id, screen_name]);
    db.q('COMMIT;');
    db.q('CREATE DATABASE "customer-' + customer_id + '" WITH OWNER = "' + owner + '" ENCODING = \'UTF8\' LC_COLLATE = \'en_US.UTF-8\' LC_CTYPE = \'en_US.UTF-8\';');
    db.on_error(function (err) {
      rollback(db.client)(err);
    });

    db.run_and_then(function (meta) {
      me.is_new = false;
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
    me.data.trashed_at  = result.trashed_at;

    Screen_names.read(me, function () {
      if (func)
        func(me, meta);
    });

  });

  return me;
};

Customer.prototype.update = function (new_vals, func) {
  var me       = this;
  var sql_vals = {};
  me.new_data  = new_vals;

  me.must_be_valid();

  _.each(me.sanitized_data, function (v, k) {
    if (k === 'email') {
      sql_vals[k] = v;
    }
  });

  var sql = pg.sql_gen.update('customers', {id: me.customer_id}, sql_vals)

  var db = new pg.query();
  db.q('BEGIN;');

  // customer data
  if (!_.isEmpty(sql_vals))
    db.q(sql.sql, sql.values);

  // screen-names data
  if (this.sanitized_data.screen_name_id && this.sanitized_data.screen_name) {
    var sn_sql = pg.sql_gen.update('screen_names', {id: this.sanitized_data.screen_name_id}, {screen_name: this.sanitized_data.screen_name});
    db.q(sn_sql.sql, sn_sql.values);
  }

  db.q('COMMIT;');

  db.on_error(function (err) {
    rollback(db.client)(err);
  });
  db.run_and_then(func);

};

Customer.prototype.trash = function (on_fin, on_err) {
  var sql = pg.sql_gen.update('customers', {id: this.data.id}, {trashed_at: 'now() AT TIME ZONE \'UTC\''});
  var db = new pg.query("UPDATE customers SET trashed_at = (now() AT TIME ZONE 'UTC') WHERE id = $1 ",  [this.data.id]);
  if (on_err)
    db.on_error(on_err);
  db.run_and_then(on_fin);
};

Customer.prototype.delete = function (on_fin) {
  var customer = pg.sql_gen.delete('customers', {id: this.data.id});
  var screen_names = pg.sql_gen.delete('screen_names', {customer_id: this.data.id});
  var customer_db = "DROP DATABASE IF EXISTS \"customer_" + this.data.id + "\"";
  var customer_db2 = "DROP DATABASE IF EXISTS \"customer-" + this.data.id + "\"";

  var db = new pg.query();
  db.q(screen_names.sql, screen_names.values);
  db.q(customer.sql, customer.values);
  db.q(customer_db);
  db.q(customer_db2);
  db.run_and_then(on_fin);
};

exports.Customer = Customer;




