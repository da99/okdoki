var pg        = require('okdoki/lib/POSTGRESQL');
var shortid    = require('shortid')
, _            = require('underscore')
, check        = pg.check
, Validator    = pg.Validator
, sanitize     = pg.sanitize
, rollback     = pg.rollback;

function Customer(new_vals) {
  this.is_new         = true;
  this.data           = {};
  this.sanitized_data = {};
  this.new_data       = {};

  if (new_vals) {
    this.new_data = new_vals;
  }

}

Customer.id_size = 15;

Customer.to_db_name = function (id) {
  if (!id)
    throw new Error('Invalid customer id: ' + id);
  return "customer-" + id;
};

Customer.prototype.must_be_valid = function (on_err) {
  this.validate();

  if (this.is_valid)
    return true;

  if (!on_err)
    throw new Error('Invalid: ' + this.errors.join(' '));

  on_err(this);
  return false;
};

Customer.prototype.screen_name_row = function (name) {
  var rows = this.data.screen_name_rows;

  if (!rows)
    throw new Error('Screen name rows not found.');

  var r = _.find(rows, function (row) { return row.screen_name === name; });

  if (!r)
    throw new Error('Id not found for customer, ' + this.data.id + ', and name: ' + name);

  return r;
};

Customer.prototype.screen_name_id = function (name) {
  return this.screen_name_row(name).id;
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
    } else {
      if (this.new_data.hasOwnProperty('new_screen_name'))
        this['new_screen_name'](this.new_data.new_screen_name);
    }

  };

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
  this.validator.check(val, 'Name, "' + (val || '') + '", must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
  this.push_sanitized_data('screen_name', val);
};

Customer.prototype.update_screen_name = function (o, n) {
  this.push_sanitized_data('screen_name_id', this.screen_name_id(o));
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
  return mem.create(on_fin, on_err);
};

Customer.prototype.create = function (func, on_err) {

  var me   = this;
  var done = arguments[1];

  if (!me.must_be_valid(on_err))
    return false;

  // var ucs  = punycode.ucs2.decode(this.screen_name).join('');
  var raw_seed = (this.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var screen_name_id = shortid.seed(seed).generate();
  var customer_id    = shortid.seed(seed).generate();
  var screen_name    = this.sanitized_data.screen_name;
  var db_name        = Customer.to_db_name(customer_id);

  this.sanitized_data.id             = customer_id;
  this.sanitized_data.seed           = seed;
  this.sanitized_data.screen_name_id = screen_name_id;
  this.sanitized_data.db_name        = db_name;

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var db = new pg.query();
  pg.show_default_owner(function (owner) {

    db.q('BEGIN;');
    db.q('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, screen_name_id]);
    db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [screen_name_id, customer_id, screen_name]);
    db.q('COMMIT;');
    db.on_error(rollback(db.client));

    db.run_and_then(function (meta) {
      me.is_new = false;
      var db = new pg.query('CREATE DATABASE "' + db_name + '" WITH OWNER = "' + owner + '" ENCODING = \'UTF8\' LC_COLLATE = \'en_US.UTF-8\' LC_CTYPE = \'en_US.UTF-8\';');
      db.run_and_then(function (meta) {
        var c_db = new pg.query('/' + me.sanitized_data.db_name);
        c_db.q('CREATE EXTENSION IF NOT EXISTS hstore;');
        c_db.q("CREATE TABLE IF NOT EXISTS homepages ( \
               screen_name_id  varchar(" + Customer.id_size + ") NOT NULL UNIQUE, \
               settings        hstore NOT NULL,                 \
               about           text) \
        ");
        c_db.q('INSERT INTO homepages (screen_name_id, settings) VALUES ($1, $2);', [screen_name_id, '']);
        c_db.run_and_then(function () {
          if (func)
            func(me, meta);
        });
      });
    });

  });

  return this;
};

Customer.prototype.create_screen_name = function (name, on_fin, on_err) {

  var me = this;
  me.new_data = {'new_screen_name': name};
  if (!me.must_be_valid(on_err))
    return false;

  var db = new pg.query();
  var id = shortid.seed(parseFloat(me.data.id.replace( /[^0-9]/g, '')) + 1).generate();

  db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [id, me.data.id, me.sanitized_data.screen_name]);
  db.on_error(on_err);
  db.run_and_then(function (meta) {
    var db = new pg.query('/' + me.data.db_name);
    db.q('INSERT INTO homepages (screen_name_id, settings) VALUES( $1, $2);', [id, '']);
    db.on_error(on_err);
    db.run_and_then(on_fin);
  });
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
    me.data.db_name = Customer.to_db_name(customer_id);

    if (func)
      func(me, meta);

  });

  return me;
};

Customer.prototype.read_screen_names = function (on_fin, on_err) {
  var me = this;
  var db = new pg.query('SELECT * FROM screen_names WHERE customer_id = $1', [me.data.id]);
  db.run_and_then(function (meta) {
    if (meta.rowCount === 0) {
      if (on_err)
        on_err(meta);
      else
        throw new Error('No screen names found for customer id: ' + me.data.id);
    } else {
      me.data.screen_names = _.pluck(meta.rows, 'screen_name');
      me.data.screen_name_rows = meta.rows;
      on_fin(me, meta);
    }
  });
};

Customer.prototype.update = function (new_vals, func) {
  var me       = this;

  if (new_vals.screen_name && !me.data.screen_names) {
    me.read_screen_names(function () {
      me.update(new_vals, func);
    });
    return false;
  }

  var sql_vals = {};
  me.new_data  = new_vals;

  if (!me.must_be_valid())
    return false;

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
  var db = new pg.query();
  db.on_error(on_err);
  db.trash('customers', this.data.id, on_fin);
};

Customer.prototype.trash_screen_name = function (n, on_fin, on_err) {
  var db  = new pg.query();
  db.on_error(on_err);
  db.trash('screen_names', this.screen_name_id(n), on_fin);
};

Customer.prototype.delete = function (on_fin) {
  var customer     = pg.sql_gen.delete('customers', {id: this.data.id});
  var screen_names = pg.sql_gen.delete('screen_names', {customer_id: this.data.id});
  var customer_db  = "DROP DATABASE IF EXISTS \"customer_" + this.data.id + "\"";
  var customer_db2 = "DROP DATABASE IF EXISTS \"customer-" + this.data.id + "\"";

  var db = new pg.query();
  db.q(screen_names.sql, screen_names.values);
  db.q(customer.sql, customer.values);
  db.q(customer_db);
  db.q(customer_db2);
  db.run_and_then(on_fin);
};

Customer.prototype.delete_screen_name = function (n, on_fin) {
  var s  = pg.sql_gen.delete('screen_names', {id: this.screen_name_id(n)});
  var db = new pg.query(s.sql, s.values);
  db.run_and_then(on_fin);
};

exports.Customer = Customer;




