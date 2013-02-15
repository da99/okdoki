var Refresh = 4 // seconds
, _         = require('underscore')
, Redis     = require('okdoki/lib/Redis').Redis
, IM        = require('okdoki/lib/IM').IM
, Validate  = require('okdoki/lib/Validate').Validate
, UID       = require('okdoki/lib/UID').UID
, PG        = require('okdoki/lib/PG').PG
, SQL       = require('okdoki/lib/SQL').SQL
, River     = require('okdoki/lib/River').River
;

var TABLE_NAME = 'screen_names';
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

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

// OST = 0; // parseInt((new Date(2013, 0, 31)).getTime());

function since() {
  return (new Date).getTime();
}

function log() {
  var args = _.map(_.toArray(arguments), function (v, i) {
    if (!_.isArray(v))
      return v;
    var arr = v;
    return ((_.isArray(arr) && arr.length > 5) ? 'Array: ' + arr.length : arr);;
  });

  console['log'].apply(console, args);
}

// ****************************************************************
// ****************** Main Stuff **********************************
// ****************************************************************

var S = exports.Screen_Name = function () {
};

S.expire_in = 4; // Refresh rate.

S.new = function (n) {
  var s         =  new S();
  s.data        = {};
  s.screen_name = n;
  return s;
};

S.prototype.heart_beep = function (on_fin) {
  var me = this;
  var n  = me.screen_name;

  var client = Redis.client.multi();

  client.hmset(n, {s: since()});
  client.expire(n, S.expire_in + 7); // online status
  client.expire(n + ':c',    secs + 7); // list of contacts
  client.expire(n + ':ims',  secs + 7); // list of ims by customer
  client.expire(n + ':dims', secs + 7); // list of direct ims to customer
  client.exec(on_fin);
};

// ****************************************************************
// ****************** Create Validators ***************************
// ****************************************************************

var Validate_Create = Validate.new('create screen name');
var VC = Validate_Create;
VC.define('screen_name', function (v) {
  v
  .match(/^[a-z0-9\-\_\.]{3,15}$/i, "Screen name must be: 3-15 valid chars: 0-9 a-z A-Z _ - .")
  ;

  _.each(banned_screen_names, function (pattern, i) {
    v.not_match(new RegExp(pattern, 'ig'), 'Screen name not allowed: ' + v.val);
  });
});

VC.define('body', function (v) {
  var val = (v.val || '').trim();
  if (val.length === 0)
    val = '* * *';
  v.sanitized(val);
});



// ****************************************************************
// ****************** Create **************************************
// ****************************************************************

S.create = function (customer, job) {

  var id = UID.generate_id(customer.new_data.ip || customer.data.id);
  var sn = S.new();
  sn.new_data = {'screen_name': customer.new_data.screen_name};

  River.new(job)
  .job('validate', 'screen name', function (j) {
    Validate_Create.validate(sn, j);
  })
  .job('create', 'screen name', function (j) {
    PG.new('create screen_name', j)
    .insert_into(TABLE_NAME, {
      id           : id,
      owner_id     : customer.data.id,
      screen_name  : ['upper($1)', sn.sanitized_data.screen_name],
      display_name : sn.sanitized_data.screen_name
    })
    .on_dup('screen_name', function () {
      return job.invalid('Screen name already exists: ' + sn.new_data.screen_name);
    })
    .run_and_on_finish(function (row, meta) {
      j.finish(row);
    });
  })
  .run_and_on_finish(function (r) {
    customer.push_screen_name_row(r.last_reply());
    job.finish(customer);
  });

};

// ****************************************************************
// ****************** Read ****************************************
// ****************************************************************

S.read_list = function (c, flow) {
  River.new()
  .job('read screen names', c.data.id, function (j) {
    PG.new(j.group + j.id)
    .q(
      SQL.select('*')
      .from(TABLE_NAME)
      .where('owner_id', j.id)
    )
    .run_and_on_finish(j.finish)
    ;
  })
  .run_and_on_finish(function (r) {
    _.each(r.last_reply(), function (row) {
      c.push_screen_name_row(row);
    });
    flow.finish(r.last_reply());
  });
};

S.prototype.read_homepage = function (name, river) {
  var me = this;
  pg.id_select( null, TABLE_NAME, 'id', me.screen_name_id(name), river);
};

S.prototype.read_screen_names = function (river) {
  var me = this;
  var db = new pg.query('SELECT * FROM screen_names WHERE owner_id = $1', [me.data.id]);
  db.run_and_then(function (meta) {
    if (meta.rowCount === 0)
      return river.invalid(['No screen names found for customer id: ' + me.data.id]);

    me.data.screen_name_rows = null;

    _.each(meta.rows, function (v, k) {
      me.push_screen_name_row(v);
    });

    river.finish(me, meta);
  });
};

// ****************************************************************
// ******************* Update Validations *************************
// ****************************************************************


S.prototype.edit_homepage_title = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('homepage_title', new_val);
};

S.prototype.edit_about = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('about', new_val);
};


S.prototype.edit_homepage_allow = function (val) {
  this.validator.check(val, "'allow' must be an array.").isArray();
  this.push_sanitized_data('homepage_allow', val);
};


S.prototype.edit_screen_name = function (n) {

  var old = this.new_data.old_screen_name;

  if (old) // updating old name
    this.push_sanitized_data('screen_name_id', this.screen_name_id(old));
  else {
    // inserting new name
  }

  this['new_screen_name'](n);
};


S.prototype.edit_read_able = function (v) {
  switch (v) {
    case 'W':
      break;
    case 'N':
      break;
    case 'S':
      break;
    default:
      throw new Error('Unknown read_able value: ' + v);
  };

  this.push_sanitized_data('read_able', v);
}

S.prototype.edit_read_able_list = function (v) {
  if (this.sanitized_data.read_able !== 'S')
    return false;

  if (!v)
    throw new Error('read_able_list can\'t be false-y: ' + typeof(v));

  var list = _.reject(v.trim().split(/[,\s]+/ig), function (str, i) {
    return str === "";
  });

  if (list.length === 0)
    this.push_sanitized_data.read_able = 'N';
  else
    this.push_sanitized_data('read_able_list', list);
}

S.prototype.edit_at_url = function (v) {
  return edit_bot_url(this, 'at_url', v);
};

S.prototype.edit_at_pass_phrase = function (v) {
  return edit_bot_pass_phrase(this, 'at_pass_phrase', v);
};

S.prototype.edit_bot_url = function (v) {
  return edit_bot_url(this, 'bot_url', v);
};

S.prototype.edit_bot_pass_phrase = function (v) {
  return edit_bot_pass_phrase(this, 'bot_pass_phrase', v);
};


// ****************************************************************
// ******************* Update *************************************
// ****************************************************************

S.prototype.update = function ( name, model, river ) {
  var me      = this;
  var name_id = me.screen_name_id(name);
  me.new_data = new_vals;
  if (!me.must_be_valid(river))
    return false;
  var v_sql = [];
  var v_arr = [];
  var d = me.sanitized_data;

  if (d.hasOwnProperty('about')) {
    v_sql.push( " about = ~x " );
    v_arr.push(d.about);
  }

  if (d.hasOwnProperty('homepage_title')) {
    v_sql.push( " details = json_merge(details, ~x) " );
    v_arr.push(JSON.stringify({ 'title' : d.homepage_title }));
  }

  if (d.hasOwnProperty('homepage_allow')) {
    v_sql.push( " settings = json_merge(settings, ~x) " );
    v_arr.push(JSON.stringify({ 'allow' : d.homepage_allow }));
  }

  if (d.hasOwnProperty('read_able')) {
    v_sql.push( " read_able = ~x " );
    v_arr.push(d.read_able);
  }

  if (d.hasOwnProperty('read_able_list')) {
    v_sql.push( " read_able_list = ARRAY[ ~x ] " );
    v_arr.push(d.read_able_list);
  }

  if (d.hasOwnProperty('new_screen_name')) {
    v_sql.push( " screen_name = ~x ")
    v_arr.push( d.new_screen_name );
  }

  if (d.hasOwnProperty('at_url')) {
    v_sql.push( " at_url =  ~x  ")
    v_arr.push( d.at_url );
  }

  if (d.hasOwnProperty('bot_url')) {
    v_sql.push( " bot_url = ~x ")
    v_arr.push( d.at_url );
  }

  if (d.hasOwnProperty('at_pass_phrase')) {
    v_sql.push( " at_pass_phrase_hash = encode_pass_phrase( ~x ) ")
    v_arr.push( d.at_pass_phrase );
  }

  if (d.hasOwnProperty('bot_pass_phrase')) {
    v_sql.push( " bot_pass_phrase_hash = encode_pass_phrase( ~x ) ")
    v_arr.push( d.bot_pass_phrase );
  }

  if (v_sql.length === 0) {
    throw new Error('No values set for update for: ' + name);
  }

  v_arr.push(name_id);
  var sql   = "UPDATE screen_names SET " + v_sql.join(', ') + " WHERE id = ~x;";
  var sqler = pg.sqler(sql, v_arr);
  var db    = new pg.query(sqler[0], sqler[1]);
  db.run_and_then(function (meta) { return river.finish(me, meta); });
};


// ****************************************************************
// ******************* Trash/Delete *******************************
// ****************************************************************

S.prototype.undo_trash_screen_name = function (n, river) {
  var db = new pg.query();
  var me = this;
  db.on_error(river);
  db.untrash(TABLE_NAME, this.screen_name_id(n), river);
};

S.prototype.trash_screen_name = function (n, river) {
  var db = new pg.query();
  var me = this;
  db.on_error(river);
  var new_on_fin = function () {
    var r = me.screen_name_row(n);
    r.trashed_at = new Date(Date.now());
    me.generate_trash_msg(n);
    return river.finish();
  };
  db.trash(TABLE_NAME, this.screen_name_id(n), new_on_fin);
};

S.prototype.delete_screen_name = function (n, river) {
  var s  = pg.sql_gen.delete(TABLE_NAME, {id: this.screen_name_id(n)});
  var db = new pg.query(s.sql, s.values);
  db.run_and_then(river.finish);
};

