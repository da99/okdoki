var pg        = require('okdoki/lib/POSTGRESQL');
var shortid    = require('shortid')
, _            = require('underscore')
, check        = pg.check
, Validator    = pg.Validator
, sanitize     = pg.sanitize
, squel        = pg.squel
, rollback     = pg.rollback
, Screen_names = require('okdoki/lib/Screen_names').Screen_names;

function Customer(customer_id, func) {
  this.is_new         = true;
  this.data           = {};
  this.sanitized_data = {};
  this.new_data       = {};
  this.Screen_names   = new Screen_names(this);
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
  this.sanitized_data.id = customer_id;
  this.sanitized_data.seed = seed;
  this.sanitized_data.screen_name = this.new_data.mask_name;

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
    me.data.id     = customer_id;
    me.data.email  = result.email;

    var name_q = new pg.query('SELECT * FROM screen_names WHERE customer_id = $1', [customer_id]);

    name_q.run_and_then(function (meta) {
      me.data.screen_names = _.pluck(meta.rows, 'screen_name');
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
        me.data[k] = v;
      });
      func(meta);
    });

  } else {
    throw new Error('Invalid: ' + this.errors.join(' '));
  };
}

exports.Customer = Customer;




