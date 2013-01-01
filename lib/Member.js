var new_pg_client = require('okdoki/lib/DB').new_pg_client;
var get_default_owner = require('okdoki/lib/DB').get_default_owner;
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
    var keys = "mask_name password ip".split(' ');
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
  this.validator.check(this.new_values.mask_name, 'Name must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
}

Member.prototype.new_password = function (v) {
  this.validator.check(this.new_values.password, 'Password must be at least 9 chars long.').is(/^.{9,}$/i);
}

Member.prototype.new_ip = function (v) {
  this.validator.check(this.new_values.ip, 'IP address is required.').len(5);
}

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

Member.prototype.create = function (func) {

  var me          = this;
  var done = arguments[1];

  if (!me.is_valid)
    throw new Error("Can't save customer. Errors: " + me.errors);

  // var ucs  = punycode.ucs2.decode(this.mask_name).join('');
  var raw_seed = (this.new_values.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));

  var mask_id     = shortid.seed(seed).generate();
  var customer_id = shortid.seed(seed).generate();

  if (!this.is_new)
    throw new Error('Can\'t create an already existing record.');

  var create_db = 'CREATE DATABASE "customer-' + customer_id + '" WITH OWNER = "' + (get_default_owner() || 'postgres') + '" ENCODING = \'UTF8\' LC_COLLATE = \'en_US.UTF-8\' LC_CTYPE = \'en_US.UTF-8\';';
  var begin = 'BEGIN;';

  // var pg = require('pg');
  // var pg_client = new pg.Client(process.env.DATABASE_URL);
  // pg_client.connect();


  var pg_client = new_pg_client();
  pg_client.query(create_db, [], function (err, meta) {
    if (err)
      rollback(pg_client)(err, meta);
    else {

      pg_client.query('BEGIN;', [], function (err, meta) {

        if (err)
          rollback(pg_client)(err, meta);
        else {

          pg_client.query('INSERT INTO customers (id, passphrase_hash) VALUES ($1, $2);', [customer_id, mask_id], function (err, meta) {
            if (err)
              rollback(pg_client)(err, meta);
            else {
              pg_client.query('INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);', [mask_id, customer_id, me.new_values.mask_name], function (err, meta) {
                if (err)
                  rollback(pg_client)(err, meta);
                else {
                  pg_client.query('COMMIT;', function (err, meta) {
                    if (err)
                      rollback(pg_client)(err, meta);
                    else {
                      me.is_new      = false;
                      me.customer_id = customer_id;

                      if (func)
                        func(me, meta);
                    };
                  });
                };
              });
            };
          });
        };

      });

    };
  });

}

Member.prototype.read = function (customer_id, func) {
  var me = this;
  var pg_client = new_pg_client();
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

    pg_client.query('SELECT * FROM screen_names WHERE customer_id = $1', [customer_id], function (err, meta) {

      if (err)
        throw err;

      me.screen_names = [];
      var i = -1, l = meta.rowCount;
      while(++i < l) {
        me.screen_names.push(meta.rows[i].screen_name);
      }

      if (func)
        func(me, meta);
    });
  });
}


exports.Member = Member;




