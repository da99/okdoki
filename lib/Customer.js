var _         = require('underscore')
, reltime     = require('reltime')
, Duration    = require('duration')
, Validate    = require('okdoki/lib/Validate').Validate
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
, UID         = require('okdoki/lib/UID').UID
, River       = require('okdoki/lib/River').River
, warn        = require('okdoki/lib/base').warn
;


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

  if (r.hasOwnProperty('at_pass_phrase_hash')) {
    r.has_at_pass_phrase = !!r.at_pass_phrase_hash;
    delete r.at_pass_phrase_hash;
  }

  if (r.hasOwnProperty('bot_pass_phrase_hash')) {
    r.has_bot_pass_phrase = !!r.bot_pass_phrase_hash;
    delete r.bot_pass_phrase_hash;
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
  var raw_seed             = (me.new_data.ip + '' + (new Date).getTime());
  var seed                 = parseFloat(raw_seed.replace( /[^0-9]/g, ''));
  var customer_id          = UID.generate_id(seed);

  if (!me.is_new)
    return flow.error('Can\'t create an already existing record.');

  me.data.id = customer_id;

  River.new(flow)

  .job('validate', 'new customer', function (j) {
    Validate_Create.validate(me, j);
  })

  .job('create', 'screen name', function (j) {
    Screen_Name.create(me, j);
  })

  .job('create', 'customer record', function (j) {

    PG.new('create customer record', j)
    .q(SQL.insert_into(TABLE_NAME).values({
      id: customer_id,
      pass_phrase_hash: ['encode_pass_phrase( $1 )', customer_id + me.sanitized_data.pass_phrase]
    }))
    .run_and_on_finish(j.finish);
  })

  .run_and_on_finish(function (c_flow) {
    me.is_new              = false;
    me.sanitized_data.id   = customer_id;
    me.sanitized_data.seed = seed;

    me.push_screen_name_row(c_flow.reply_for('create', 'screen name'));
    flow.finish(me);
  });

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
  .run_and_on_finish(function (r) {
    Customer.read_by_id(_.extend(opts, {id: r.owner_id}), flow);
  });
};

Customer.read_by_id = function (id_or_hash, flow) {

  var opts = (_.isString(id_or_hash)) ?
    {id: id_or_hash} :
    id_or_hash;

  var me = new Customer();
  var sql = SQL.select('*').from(TABLE_NAME).where('id', opts.id).limit(1);
  if (opts.hasOwnProperty('pass_phrase')) {
    sql.and(' pass_phrase_hash = encode_pass_phrase( $1 ) ', [opts.id + opts.pass_phrase]);
  }

  River.new(flow)
  .job('read customer', opts.screen_name || opts.id, function (j) {
    PG.new('read customer id: ' + j.id, j)
    .q(sql)
    .run_and_on_finish(function (row) {
      me.is_new          = false;
      me.customer_id     = row.id;
      me.data.id         = row.id;
      me.data.email      = row.email;
      me.data.trashed_at = row.trashed_at;
      j.finish(me);
    })
    ;
  })
  .job('read screen names', opts.id, function (j) {
    Screen_Name.read_list(me, j);
  })
  .run_and_on_finish(function (r) {
    flow.finish(me);
  });


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
    .run_and_on_finish(j.finish);

  })

  .run_and_on_finish(function (r) {
    me.data = r.last_reply();
    flow.finish(me);
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

Customer.prototype.trash = function (flow) {
  var me = this;
  PG.new('trash customer: ' + me.data.id)
  .q(SQL.trash(TABLE_NAME).where('id', me.data.id))
  .run_and_on_finish(function (row) {
    me.data.trashed_at = row.trashed_at;
    flow.finish(me);
  });;
};

Customer.delete_trashed = function (flow) {
  var sql = "SELECT id \n" +
    "FROM customers \n" +
    "WHERE CASE WHEN trashed_at IS NOT NULL THEN \n" +
    "(extract(epoch from ( timezone('UTC'::text, now()) - trashed_at)) / 60 / 60) > 48 \n" +
    "ELSE false END";
  PG.new('delete customers and screen names')
  .q("DELETE FROM screen_names WHERE owner_id IN (" + sql + ") RETURNING owner_id ;")
  .q("DELETE FROM customers WHERE id in (" + sql + ") RETURNING id ;")
  .run_and_on_finish(flow.finish);
};





