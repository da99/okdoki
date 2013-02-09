var pg = require('okdoki/lib/POSTGRESQL');

var banned_screen_names = [
  '^megauni',
  '^okdoki',
  '^pet-',
  '^(online|contact|info|official|about|news|home)$',
  '^(undefined|def|sex|sexy|xxx|ted|larry)$',
  '^coke$',
  '^[.]+-cola$',
  'pepsi'
];

var _       = require('underscore')
, reltime   = require('reltime')
, Duration  = require('duration')
, check     = pg.check
, Validator = pg.Validator
, sanitize  = pg.sanitize
, rollback  = pg.rollback;

function add_s(v) {
  return (v > 1 ? 's' : '');
}

function human_durs(durs) {
  var msg = [];
  var d = durs.day;
  var h = durs.hour;
  var m = durs.minute;
  var v = null;

  if (d === 1 && h === 23 && m > 45) {
    d = 2;
    h = 0;
    m = 0;
  }

  v = d;
  if (v > 0)
    msg.push( v + " day" + add_s(v) );

  v = h;
  if (v > 0)
    msg.push(v + " hr" + add_s(v));

  v = m;
  if (v > 0)
    msg.push(v + " min" + add_s(v));

  return msg.join(', ');
}

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
  7: 'cheer',
  8: 'question',
  9: 'answer'
};


// ****************************************************************
// *************** Helper Methods**********************************
// ****************************************************************

Customer.to_section_name = function (id) {
  var a = Customer.section_ids[id];
  if (!a)
    throw new Error("Unknown section id: " + id);
  return a;
};

Customer.to_section_id = function (name) {
  var a = _.invert(Customer.section_ids)[name];
  if (!a)
    throw new Error("Unknown section name: " + name);
  return a;
};

Customer.prototype.push_sanitized_data = function (k, val) {
  if (!this.validator.has_errors()) {
    this.sanitized_data[k] = val;
  }
};

Customer.prototype.push_screen_name_row = function (r) {
  var me    = this;
  var rows  = me.data.screen_name_rows;
  var names = [];

  if (!rows) {
    me.data.screen_name_rows = rows = [];
    me.data.screen_names     = names = [];
  }

  r.is_trashed = !!r.trashed_at;

  if (r.is_trashed)
    me.generate_trash_msg(r);

  r.world_read   = r.read_able === 'W';
  r.no_one_read  = r.read_able === 'N';
  r.specify_read = r.read_able === 'S';

  if (r.hasOwnProperty('at_passphrase_hash')) {
    r.has_at_passphrase = !!r.at_passphrase_hash;
    delete r.at_passphrase_hash;
  }

  if (r.hasOwnProperty('bot_passphrase_hash')) {
    r.has_bot_passphrase = !!r.bot_passphrase_hash;
    delete r.bot_passphrase_hash;
  }

  rows.push(r);
  names.push(r.screen_name);
  return r;
}

Customer.prototype.screen_name_row = function (name) {
  var rows = this.data.screen_name_rows;

  if (!rows)
    throw new Error('Screen name rows not found.');

  var r = _.find(rows, function (row) { return row.screen_name === name.toUpperCase(); });

  if (!r)
    throw new Error('Id not found for customer, ' + this.data.id + ', and name: ' + name);

  return r;
};

Customer.prototype.screen_name_id = function (name) {
  return this.screen_name_row(name).id;
};

Customer.prototype.screen_name_ids = function (arr) {
  var me = this;

  if (arguments.length === 0)
    return _.pluck(me.data.screen_name_rows, 'id');

  return _.map(arr, function (v) {
    return me.screen_name_row(v).id;
  });
};

// ****************************************************************
// ******************* VALIDATIONS ********************************
// ****************************************************************


Customer.prototype.must_be_valid = function (unk_1, unk_2) {
  var vals   = null;
  var on_err = null;

  if (unk_1 && _.isArray(unk_1.keys))
    vals = unk_1;

  if (_.isFunction(unk_1))
    on_err = unk_1;

  if (_.isFunction(unk_2))
    on_err = unk_2;

  this.validate(vals);

  if (this.is_valid)
    return true;

  if (!on_err)
    throw new Error('Invalid: ' + this.errors.join(' '));

  on_err(this);
  return false;
};

Customer.prototype.validate = function (o) {
  if (!o)
    o = {};
  var keys          = o.keys;
  var prefix        = o.prefix;
  var me            = this;
  me.sanitized_data = {};
  me.validator      = new Validator();
  var valid         = me.validator;
  var k             = null;
  var is_valid      = true;

  if (this.is_new) {

    if (!keys) {
      keys = "passphrase confirm_passphrase ip screen_name".split(' ');
      prefix = 'new_'
    }
    _.each( keys, function (k, i) {
      if (is_valid) {
        me[prefix + k](me.new_data[k]);
        me.is_valid = is_valid = !valid.has_errors();
      }
    });

  } else {

    if (!keys) {
      keys = [
        'screen_name',
        'email',
        'about',
        'homepage_title',
        'homepage_allow',
        'read_able',
        'read_able_list',
        'at_url',
        'bot_url',
        'at_passphrase',
        'bot_passphrase'
      ];
      prefix = 'edit_';
    }

    _.each( keys, function (k, i) {

      if (is_valid && me.new_data.hasOwnProperty(k)) {
        me[prefix + k](me.new_data[k]);
        me.is_valid = is_valid = !valid.has_errors();
      };

    });

  };

  if (!is_valid && !valid.has_errors())
    throw new Error('Check key names because none were found in new_data: ' + keys);
  this.errors = valid.get_errors();
};



// ****************************************************************
// *******************  CRUD **************************************
// ****************************************************************


// ****************************************************************
// ******************* Create Validations *************************
// ****************************************************************

Customer.prototype.new_passphrase = function (v) {
  return edit_passphrase(this, 'passphrase', v);
};

Customer.prototype.new_confirm_passphrase = function (pc) {
  var new_pc = (pc || "").trim();
  var new_p  = this.sanitized_data.passphrase || "";
  this.validator.check(new_pc, 'Passphrase confirmation does not match passphrase.').equals(new_p);
};

Customer.prototype.new_ip = function (v) {
  this.validator.check(v, 'IP address is required.').len(5);
  this.push_sanitized_data('ip', v);
};

Customer.prototype.new_screen_name = function (raw_val) {
  var me  = this;
  var val = (raw_val || '').trim();

  me.validator.check(val, 'Name, "' + val + '", must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
  _.each(banned_screen_names, function (v, i) {
    me.validator.check(val, 'Screen name not allowed: ' + val).notRegex(v, 'ig');
  });

  me.push_sanitized_data('screen_name', val);
};

Customer.prototype.new_body = function (val, name) {
  val = (val || '').trim();
  if (!name)
    name = 'Body';
  this.validator.check(val, name + ', "' + val + '", must not be empty.').notEmpty();
  this.push_sanitized_data('body', val);
};


// ****************************************************************
// ******************* Create *************************************
// ****************************************************************

Customer.create = function (new_vals, river) {
  var mem = new Customer(new_vals);
  return mem.create(river);
};

Customer.create.screen_name_insert_sql = '\
INSERT INTO screen_names (id, owner_id, screen_name, display_name) \
VALUES ($1, $2, upper($3), $3);';

Customer.prototype.create = function (river) {

  var me   = this;
  var done = arguments[1];

  if (!me.must_be_valid(river))
    return false;

  // var ucs  = punycode.ucs2.decode(this.screen_name).join('');
  var raw_seed = (this.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var screen_name_id = pg.generate_id(seed);
  var customer_id    = pg.generate_id(seed);
  var screen_name    = this.sanitized_data.screen_name;
  var passphrase     = this.sanitized_data.passphrase;

  this.sanitized_data.id             = customer_id;
  this.sanitized_data.seed           = seed;
  this.sanitized_data.screen_name_id = screen_name_id;

  if (!this.is_new)
    return river.error(new Error('Can\'t create an already existing record.'));

  var db = new pg.query();

  db.on_error(rollback(db.client));

  db.q('BEGIN;');
  db.q("INSERT INTO customers (id, passphrase_hash) VALUES ( $1, encode_passphrase( $2 ) );", [customer_id, customer_id + passphrase]);
  db.q(Customer.create.screen_name_insert_sql, [screen_name_id, customer_id, screen_name]);
  db.q('COMMIT;');
  db.q('SELECT * FROM screen_names WHERE owner_id = $1', [customer_id]);

  db.run_and_then(function (meta) {
    me.is_new = false;
    me.data.id = customer_id;
    me.push_screen_name_row(meta.rows[0]);
    river.finish(me, meta);
  });


  return this;
};

// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************

Customer.read_by_screen_name = function ( n, river ) {
  var db = new pg.query();
  db.q('SELECT * FROM screen_names WHERE screen_name = upper($1);', [n]);
  db.run_and_then(function (meta) {
    var r = meta.rows[0];
    if (r) {
      Customer.read(r.owner_id, function (c, c_meta) {
        c.push_screen_name_row(r);
        river.finish(c, c_meta);
      });
    } else {
      river.invalid(["Not found: " + n]);
    }
  });
};

Customer.read = function (id, river) {
  var mem = new Customer();
  return mem.read(id, river);
};

Customer.prototype.read = function (customer_id, river) {

  var me          = this;
  var db          = new pg.query();
  var screen_name = null;
  var passphrase  = null;

  if (_.isString(customer_id)) {
    db.q('SELECT * FROM customers WHERE id = $1', [customer_id]);
  } else {

    screen_name = customer_id.screen_name;
    passphrase  = customer_id.passphrase;
    customer_id = null;

    db.q(" \
      SELECT * \
      FROM customers \
      WHERE id IN (SELECT owner_id FROM screen_names WHERE screen_name = upper($1) LIMIT 1) \
        AND passphrase_hash = encode_passphrase( id || $2 ) \
      LIMIT 1; \
    ", [screen_name, passphrase]);
  }
  db.run_and_then(function (meta) {

    if (meta.rowCount === 0)
      return river.error(new Error('Customer not found: ' + (customer_id || screen_name)));

    if (meta.rowCount != 1)
      return river(new Error('Unknown error: Trying to read customer: ' + (customer_id || screen_name)));

    var result         = meta.rows[0];
    me.is_new          = false;
    me.customer_id     = result.id;
    me.data.id         = result.id;
    me.data.email      = result.email;
    me.data.trashed_at = result.trashed_at;

    river.finish(me, meta);

  });

  return me;
};

Customer.prototype.read_contacts_for = function (screen_name_id, river) {
  var me = this;
  var db = new pg.query();
  db.q("SELECT contacts.*, screen_names.screen_name \
       FROM contacts INNER JOIN screen_names \
         ON (contacts.owner_id = screen_names.id AND screen_names.trashed_at IS NULL)\
       WHERE contacts.owner_id IN ($1) \
         AND contacts.contact_id = $2 \
         AND contacts.trashed_at IS NULL;",
       [me.screen_name_ids(), screen_name_id]);

  db.run_and_then(function (meta) {
    me.data.contact_menu = {};
    _.each(meta.rows, function (r) {
      me.data.contact_menu[r.screen_name] = true;
    });

    river.finish(me);
  });

};

Customer.prototype.read_mutual_contacts = function (river) {
  var me  = this;
  var db  = new pg.query();
  var sql = "\
SELECT \
  all_contacts.owner_id,                                  \
  owner_screen_names.screen_name AS owner_screen_name,    \
  all_contacts.contact_id,                                \
  contact_screen_names.screen_name AS contact_screen_name \
FROM                                                      \
(                                                         \
  SELECT id, owner_id, contact_id                         \
  FROM contacts                                           \
  WHERE trashed_at IS NULL AND owner_id IN                \
    (                                                     \
      SELECT id                                           \
      FROM screen_names                                   \
      WHERE screen_names.owner_id = $1                    \
      AND screen_names.trashed_at IS NULL                 \
    )                                                     \
) AS all_contacts   \
INNER JOIN          \
(                   \
  SELECT owner_id   \
  FROM contacts     \
  WHERE trashed_at IS NULL AND contact_id IN \
  (                 \
     SELECT id      \
     FROM screen_names                    \
     WHERE screen_names.owner_id = $1     \
     AND screen_names.trashed_at IS NULL  \
   )                                      \
 ) AS other_contacts ON                   \
(all_contacts.contact_id = other_contacts.owner_id)       \
  LEFT OUTER JOIN screen_names AS owner_screen_names      \
  ON (all_contacts.owner_id = owner_screen_names.id)      \
  LEFT OUTER JOIN screen_names AS contact_screen_names    \
  ON (all_contacts.contact_id = contact_screen_names.id)  \
";
  var vals = [me.data.id];
  db.q(sql, [me.data.id]);
  db.run_and_then(function (meta) {

    var menu_by_c = {};
    var menu_by_o = {};

    _.each(meta.rows, function(v, i) {

      var c_n = v.contact_screen_name;
      var o_n = v.owner_screen_name;

      if (!menu_by_c[c_n])
        menu_by_c[c_n] = [];

      if (!menu_by_o[o_n])
        menu_by_o[o_n] = []

      menu_by_c[c_n].push(o_n);
      menu_by_o[o_n].push(c_n);

    });

    river.finish(meta.rows, menu_by_c, menu_by_o);
  });
};

// ****************************************************************
// ******************* Update Validations *************************
// ****************************************************************

Customer.prototype.edit_email = function (raw_v) {
  var v = raw_v.toString().trim();
  if (v.length === 0)
    this.sanitized_data.email = null;
  else
    this.sanitized_data.email = v;
};


Customer.prototype.update = function (new_vals, river) {
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

  db.on_error(river);
  db.run_and_then(function (meta) { river.finish(meta); };);
};

Customer.prototype.update_contacts = function (new_vals, river) {
  var me         = this;
  var record_id  = pg.generate_id(new_vals.ip);
  var contact_id = null;
  var sql = "UPDATE contacts \
           SET trashed_at = (now() AT TIME ZONE 'UTC') \
           WHERE owner_id IN ( $1 ) AND contact_id = $2;";

  Customer.read_by_screen_name(new_vals.contact_screen_name, function (c) {

    contact_id = c.screen_name_id(new_vals.contact_screen_name);

    var db = new pg.query();
    var ignore     = _.difference(me.data.screen_names, new_vals.as);
    var ignore_ids = me.screen_name_ids(ignore);
    var owner_ids  = me.screen_name_ids(new_vals.as);

    _.each( owner_ids, function (owner_id) {

      db.ignore_next_duplicate('unique_to_owner');
      db.q("INSERT INTO contacts (id, owner_id, contact_id) \
           VALUES ($1, $2, $3);",
           [record_id, owner_id, contact_id]
          );

    });

    if (owner_ids.length > 0) {
      db.q("UPDATE contacts \
           SET trashed_at = null \
           WHERE owner_id IN ( $1 ) AND contact_id = $2;",
           [owner_ids, contact_id]
          );
    }

    if (ignore_ids.length > 0)
      db.q(sql, [ignore_ids, contact_id]);

    db.run_and_then(function (meta) { river.finish(meta); });

  });

};

// ****************************************************************
// ******************* Trash/Delete *******************************
// ****************************************************************

Customer.prototype.generate_trash_msg = function (name_or_row) {
  var me = this;

  if (name_or_row.screen_name) {
    var name = name_or_row.screen_name;
    var r    = name_or_row;
  } else {
    var name = name_or_row;
    var r    = me.screen_name_row(name);
  }

  if (!r.trashed_at) {

    r.trash_msg = null;

  } else {
    var durs    = new Duration(new Date(Date.now()), reltime.parse(r.trashed_at, "48 hours"));
    var is_past = durs.days < 1 && durs.hour < 1 && durs.minute < 1;
    r.trash_msg = "Screen name, " + r.screen_name;

    if (is_past) {
      r.trash_msg += ", has been deleted. There is no undo.";
    } else {
      r.trash_msg += ", has been put in trash.";
      r.trash_msg += " You have " + human_durs(durs) + " from now to change your mind before it gets completely deleted.";
    }

  }

  return r.trash_msg;
};

Customer.prototype.trash = function (river) {
  var db = new pg.query();
  db.on_error(river);
  db.trash('customers', this.data.id, river);
};

Customer.prototype.delete = function (river) {
  var customer     = pg.sql_gen.delete('customers', {id: this.data.id});
  var screen_names = pg.sql_gen.delete('screen_names', {owner_id: this.data.id});

  var db = new pg.query();
  db.q(screen_names.sql, screen_names.values);
  db.q(customer.sql, customer.values);
  db.run_and_then(function (meta) {
    river.finish();
  });
};





