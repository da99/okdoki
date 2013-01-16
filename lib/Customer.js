var pg        = require('okdoki/lib/POSTGRESQL');
var shortid    = require('shortid')
, _            = require('underscore')
, check        = pg.check
, Validator    = pg.Validator
, sanitize     = pg.sanitize
, rollback     = pg.rollback;

// ****************************************************************
// *************** Main Object ************************************
// ****************************************************************


var Customer = exports.Customer = function (new_vals) {
  this.is_new         = true;
  this.data           = {};
  this.sanitized_data = {};
  this.new_data       = {};

  if (new_vals) {
    this.new_data = new_vals;
  }

}

// ****************************************************************
// *************** Settings ***************************************
// ****************************************************************

Customer.id_size = 15;

Customer.section_ids = {
  1: 'random',
  2: 'status',
  3: 'event',
  4: 'emergency',
  5: 'article',
  6: 'jeer',
  7: 'cheer'
};


// ****************************************************************
// *************** Helper Methods**********************************
// ****************************************************************

Customer.to_section_name = function (id) {
  return Customer.section_ids[id];
};

Customer.to_section_id = function (name) {
  return _.invert(Customer.section_ids)[name];
};

Customer.prototype.push_sanitized_data = function (k, val) {
  if (!this.validator.has_errors()) {
    this.sanitized_data[k] = val;
  }
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

// ****************************************************************
// ******************* VALIDATIONS ********************************
// ****************************************************************

Customer.prototype.validate = function (vals) {
  var me            = this;
  me.sanitized_data = {};
  me.validator      = new Validator();
  var valid         = me.validator;
  var k             = null;

  if (this.is_new) {

    var keys = "password ip screen_name".split(' ');
    _.each( ['password', 'ip', 'screen_name'], function (k, i) {
      me['new_' + k](me.new_data[k]);
    });

  } else {

    _.each( ['screen_name', 'email', 'homepage_about', 'homepage_title', 'homepage_allow'], function (k, i) {

      if (me.new_data.hasOwnProperty(k))
        me['edit_' + k](me.new_data[k]);

    });

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

Customer.prototype.edit_homepage_title = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('homepage_title', new_val);
};

Customer.prototype.edit_homepage_about = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('homepage_about', new_val);
};

Customer.prototype.edit_homepage_allow = function (val) {
  this.validator.check(val, "'allow' must be an array.").isArray();
  this.push_sanitized_data('homepage_allow', val);
};

Customer.prototype.edit_email = function (raw_v) {
  var v = raw_v.toString().trim();
  if (v.length === 0)
    this.sanitized_data.email = null;
  else
    this.sanitized_data.email = v;
};

Customer.prototype.edit_screen_name = function (n) {

  var old = this.new_data.old_screen_name;

  if (old) // updating old name
    this.push_sanitized_data('screen_name_id', this.screen_name_id(old));
  else {
    // inserting new name
  }

  this['new_screen_name'](n);
};



// ****************************************************************
// *******************  CRUD **************************************
// ****************************************************************


// ****************************************************************
// ******************* Create *************************************
// ****************************************************************

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

  this.sanitized_data.id             = customer_id;
  this.sanitized_data.seed           = seed;
  this.sanitized_data.screen_name_id = screen_name_id;

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var db = new pg.query();

  db.on_error(rollback(db.client));

  db.q('BEGIN;');
  db.q('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, screen_name_id]);
  db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [screen_name_id, customer_id, screen_name]);
  db.q('INSERT INTO homepages (screen_name_id) VALUES ($1);', [screen_name_id]);
  db.q('COMMIT;');

  db.run_and_then(function (meta) {
    me.is_new = false;
    if (func)
      func(me, meta);
  });


  return this;
};

Customer.prototype.create_screen_name = function (name, on_fin, on_err) {

  var me = this;
  me.new_data = {'screen_name': name};

  if (!me.must_be_valid(on_err))
    return false;

  var db = new pg.query();
  var id = shortid.seed(parseFloat(me.data.id.replace( /[^0-9]/g, '')) + 1).generate();

  db.on_error(rollback(db.client, on_err));

  db.q('BEGIN;');
  db.q('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [id, me.data.id, me.sanitized_data.screen_name]);
  db.q('INSERT INTO homepages (screen_name_id) VALUES( $1);', [id]);
  db.q('COMMIT;');

  db.run_and_then(on_fin);
};


// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************

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

Customer.prototype.read_homepage = function (name, on_fin, on_err) {
  var me = this;
  var id = me.screen_name_id(name);
  pg.id_select( null, 'homepages', 'screen_name_id', id, on_fin, on_err);
};

Customer.prototype.read_feed = function (on_fin) {
  var me  = this;
  var sql = "SELECT * \
    FROM POSTS  \
    WHERE       \
      pub_id IN (SELECT pub_id FROM follows WHERE screen_name_id IN (SELECT id FROM screen_names WHERE customer_id = $1)) \
      AND \
       ( (json_get_varchar_array(settings, 'allow') && array_cat(ARRAY[$2]::varchar[], ARRAY(SELECT id FROM screen_names WHERE customer_id = $1))::varchar[] )\
          OR  \
         (json_get_varchar_array(settings, 'allow') && ARRAY(SELECT label_id FROM labelings WHERE pub_id IN (SELECT id FROM screen_names WHERE customer_id = $1))::varchar[]) \
       ) \
      AND \
      NOT (json_get_varchar_array(settings, 'disallow') && array_cat(ARRAY[$2]::varchar[], ARRAY(SELECT id FROM screen_names WHERE customer_id = $1))::varchar[]) \
    LIMIT 10;";
  var db  = new pg.query();
  db.q(sql, [me.data.id, "@"]);
  db.run_and_then(function (meta) {
    var rows = _.map(meta.rows, function (r, i) {
      r.settings = JSON.parse(r.settings || '{}');
      r.details  = JSON.parse(r.details  || '{}');
      return r;
    });
    on_fin(rows);
  });
};


// ****************************************************************
// ******************* Update *************************************
// ****************************************************************

Customer.prototype.update_homepage = function ( name, new_vals, on_fin, on_err ) {
  var me = this;
  me.new_data = new_vals;
  if (!me.must_be_valid(on_err))
    return false;
  var v_sql = "";
  var v_arr = [];
  var d = me.sanitized_data;

  if (d.hasOwnProperty('homepage_about')) {
    v_sql += " about = ~x ";
    v_arr.push(d.homepage_about);
  }

  if (d.hasOwnProperty('homepage_title')) {
    v_sql += " details = json_merge(details, ~x) "
    v_arr.push(JSON.stringify({ 'title' : d.homepage_title }));
  }

  if (d.hasOwnProperty('homepage_allow')) {
    v_sql += " settings = json_merge(settings, ~x) "
    v_arr.push(JSON.stringify({ 'allow' : d.homepage_allow }));
  }

  if (v_sql.length === 0) {
    var e = new Error('No values set for update for: ' + name);
    if( on_err )
      on_err(e)
    else
      throw e;
  }

  v_arr.push(me.screen_name_id(name));
  var sql   = "UPDATE homepages SET " + v_sql + " WHERE screen_name_id = ~x;";
  var sqler = pg.sqler(sql, v_arr);
  var db    = new pg.query(sqler[0], sqler[1]);
  db.on_error(on_err);
  db.run_and_then(on_fin);
};

Customer.prototype.update_screen_name = function (o, n, on_fin, on_err) {

  var me = this;

  me.new_data = { old_screen_name: o, screen_name: n };
  if (!me.must_be_valid(on_err))
    return false;

  var name = me.sanitized_data.screen_name;
  var id   = me.sanitized_data.screen_name_id;
  var db   = new pg.query();
  db.q("UPDATE screen_names SET screen_name = $1 WHERE id = $2;", [ name, id ]);
  db.run_and_then(on_fin);
};

Customer.prototype.update = function (new_vals, on_fin, on_err) {
  var me = this;

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
  var db  = new pg.query(sql.sql, sql.values);

  db.on_error(on_err);
  db.run_and_then(on_fin);
};


// ****************************************************************
// ******************* Trash/Delete *******************************
// ****************************************************************

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

  var db = new pg.query();
  db.q(screen_names.sql, screen_names.values);
  db.q(customer.sql, customer.values);
  db.run_and_then(on_fin);
};

Customer.prototype.delete_screen_name = function (n, on_fin) {
  var s  = pg.sql_gen.delete('screen_names', {id: this.screen_name_id(n)});
  var db = new pg.query(s.sql, s.values);
  db.run_and_then(on_fin);
};





