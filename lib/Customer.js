var _         = require('underscore')
, reltime     = require('reltime')
, Duration    = require('duration')
, Validate    = require('okdoki/lib/Validate').Validate
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, UID         = require('okdoki/lib/UID').UID
, River       = require('okdoki/lib/River').River
, Topogo      = require('okdoki/lib/Topogo').Topogo
, warn        = require('okdoki/lib/base').warn
, crypto      = require('crypto')
;


function encode_pass_phrase ( seed, pass_phrase ) {
  return crypto.createHash('sha512').update(seed + pass_phrase).digest('hex');
}

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


var Customer = exports.Customer = function () {
  this.is_new         = true;
  this.data           = {};
  this.sanitized_data = {};
  this.new_data       = {};
};

Customer.new = function () {
  var mem = new Customer();
  return mem;
};

// ****************************************************************
// *************** Settings ***************************************
// ****************************************************************

var TABLE_NAME = Customer.TABLE_NAME = 'customers';

// ****************************************************************
// *************** Helper Methods**********************************
// ****************************************************************

Customer.prototype.is = function (name) {
  return !!this.find_screen_name_row(name);
};

Customer.prototype.find_screen_name_row = function (raw_name) {
  if (!raw_name)
    throw new Error('Name must be specified: ' + raw_name);

  var name = (raw_name || '').toUpperCase();
  var rows = this.data.screen_name_rows;

  if (!rows)
    throw new Error('Screen name rows not found.');

  return _.find(rows, function (row) {
    return row.screen_name === name || row.display_name.toUpperCase() === name;
  });
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

  if (!r.id && r._key)
    r.id = r._key;

  if (!rows) {
    me.data.screen_name_rows = rows = {};
  }

  r.is_trashed = !!r.trashed_at;

  if (r.is_trashed)
    me.generate_trash_msg(r);

  r.world_read   = r.read_able === 'W';
  r.no_one_read  = r.read_able === 'N';
  r.specify_read = r.read_able === 'S';

  _.each('settings details'.split(' '), function (name, i) {
    if (r.hasOwnProperty(name)) {
      if (!r[name] || (r[name].trim && r[name] === ''))
        r[name] = {};
      else
        r[name] = JSON.parse(r[name]);
    }
  });

  rows[r.id] = r;
  return r;
}

Customer.prototype.screen_name_row = function (name) {
  var r = this.find_screen_name_row(name);

  if (!r)
    throw new Error('Id not found for customer, ' + this.data.id + ', and name: ' + name);

  return r;
};

Customer.prototype.screen_names = function () {
  var me = this;
  return _.pluck(me.data.screen_name_rows, 'screen_name').sort();
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
// ******************* Validations Helpers ************************
// ****************************************************************


Customer.prototype.validate = function (prefix, keys, o, j) {
  var me            = this;
  me.sanitized_data = {};
  var k             = null;
  var is_valid      = true;

  if (this.is_new) {

    if (!keys) {
      keys = "pass_phrase confirm_pass_phrase ip screen_name".split(' ');
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
        'at_pass_phrase',
        'bot_pass_phrase'
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

var Validate_Create = Validate.new('create customer', function (vc) {

  vc.define('pass_phrase', function (validator) {
    validator
    .between(10, 100)
    .at_least_2_words()
    ;
  });

  vc.define('confirm_pass_phrase', function (vador) {
    vador
    .equals(vador.sanitized('pass_phrase'), "Pass phrase is different than pass phrase confirmation.")
    ;
  });

  vc.define('ip', function (v) {
    v
    .not_empty('IP address is required.')
    .length_gte(5, 'Valid ip address is required.')
    ;
  });
});


// ****************************************************************
// ******************* Create *************************************
// ****************************************************************

Customer.create = function (new_vals, flow) {
  var me      = Customer.new();
  me.new_data = new_vals;

  if (!me.new_data.ip) {
    warn('IP address not provided. Using default: 000.000.000');
    me.new_data.ip = '000.000.000';
  }

  // var ucs  = punycode.ucs2.decode(this.screen_name).join('');
  var seed        = UID.to_float(me.new_data.ip + '' + (new Date).getTime());
  var customer_id = UID.create_id(seed);

  if (!me.is_new)
    return flow.error('Can\'t create an already existing record.');

  me.data.id = customer_id;

  var final = {
    id   : customer_id,
    pass_phrase_hash : encode_pass_phrase( customer_id, me.sanitized_data.pass_phrase)
  };

  River.new(flow)

  .job('validate', 'new customer', function (j) {
    Validate_Create.validate(me, j);
  })

  .job('create', 'screen name', function (j) {
    Screen_Name.create(me, j);
  })

  .job('create', 'customer record', function (j) {
    Topogo.new(Customer.TABLE_NAME).create(final, j);
  })

  .reply(function (c_flow) {
    me.is_new              = false;
    me.sanitized_data.id   = customer_id;
    me.sanitized_data.seed = seed;

    return me;
  })

  .run();

  return me;
};

// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************

Customer.read_by_screen_name = function ( s_or_hash, flow ) {
  var opts = (_.isString(s_or_hash)) ?
    {screen_name : s_or_hash} :
    s_or_hash;

  PG.new('read by screen name', flow)
  .q( SQL
     .select('owner_id')
     .from(Screen_Name.TABLE_NAME)
     .where(' screen_name = UPPER( $1 ) ', [opts.screen_name])
     .limit(1)
    )
  .run(function (r) {
    Customer.read_by_id(_.extend(opts, {id: r.owner_id}), flow);
  });
};

Customer.read_by_id = function (id_or_hash, flow) {

  var opts = (_.isString(id_or_hash)) ?
    {id: id_or_hash} :
    id_or_hash;

  var me = new Customer();
  if (opts.hasOwnProperty('pass_phrase')) {
    sql.and(' pass_phrase_hash = encode_pass_phrase( $1 ) ', [opts.id + opts.pass_phrase]);
  }

  River.new(flow)
  .job_with_1_reply('Customer', opts.screen_name || opts.id, function (j) {
    Topogo.new(TABLE_NAME)
    .read_one_by_example({id: opts.id}, j);
  })
  .reply(function (row) {
    me.is_new          = false;
    me.customer_id     = row.id;
    me.data.id         = row.id;
    me.data.email      = row.email;
    me.data.trashed_at = row.trashed_at;
    return me;
  })
  .job('read screen names', opts.id, function (j) {
    Screen_Name.read_list(me, j);
  })
  .run();

};


// ****************************************************************
// ******************* Update Validations *************************
// ****************************************************************


var Validate_Update = Validate.new('update customer', function (vc) {

  vc.define('email', function (validator) {
    // Do nothing.
  });

});

Customer.prototype.update = function (new_data, flow) {
  var me      = this;
  me.new_data = new_data;

  River.new(flow)

  .job('validate update', 'customer',  function (j) {
    Validate_Update.validate(me, j)
  })

  .job('update', 'customer', function (j) {

    var set = {};
    _.each('email'.split(' '), function (key, i) {
      if (me.sanitized_data.hasOwnProperty(key))
        set[key] = me.sanitized_data[key];
    });

    PG.new('update customer', j)
    .q(SQL
       .update(TABLE_NAME)
       .set(set)
       .where('id', me.data.id)
      )
    .run();

  })

  .reply(function (r) {
    me.data = r;
    return me;
  })

  .run();

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

Customer.prototype.trash = function (flow) {
  var me = this;
  PG.new('trash customer: ' + me.data.id, flow)
  .q(SQL.trash(TABLE_NAME).where('id', me.data.id))
  .reply(function (row) {
    me.data.trashed_at = row.trashed_at;
    return me;
  })
  .run();
};

Customer.delete_trashed = function (flow) {

  var final = {customers: [], screen_names: []};

  River.new(flow)

  .job('delete customers', function (j) {
    PG.new(j.group, j)
    .delete_trashed(Customer.TABLE_NAME)
    .run();
  })

  .job(function (j, rows) {
    if (!rows.length)
      return j.finish(rows);

    final.customers = rows;

    var sql = "DELETE FROM " + Screen_Name.TABLE_NAME +
      " WHERE owner_id IN ( " + _.map(rows, function (n, i) {
      return "$" + (i + 1);
    }).join(', ') + " ) RETURNING * ;"

    PG.new('delete screen names', j)
    .q([sql, _.pluck(rows, 'id')])
    .run();

  })

  .reply(function (sn_rows) {
    final.screen_names = sn_rows;
    return final;
  })

  .run();

};





