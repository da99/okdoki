var Refresh = 4 // seconds
, _         = require('underscore')
, Check     = require('da_check').Check
, River     = require('da_river').River
, Topogo    = require('topogo').Topogo
, UID       = require('../App/UID').UID
, IM        = require('../IM/model').IM
, Website   = require('../Website/model').Website
, Folder    = require('../Folder/model').Folder
, Ok        = require('../Ok/model')
, path      = require('path')
, log       = require("../App/base").log
, EVE       = require('tally_ho').Tally_Ho
;

var valid_chars = "a-zA-Z0-9\\-\\_\\.";
var VALID_SCREEN_NAME = new RegExp( '^[' + valid_chars + ']{4,15}$' );
var INVALID_CHARS = new RegExp( '[^' + valid_chars + ']', 'ig' );

var WORLD = '@W';

var TABLE_NAME = 'Screen_Name';
var TABLE = Topogo.new(TABLE_NAME);

var banned_screen_names = [
  '^megauni',
  '^miniuni',
  '^okdoki',
  '^(me|mine|my|mi|I)$',
  '^pet-',
  '^bot-',
  '^(online|contact|info|official|about|news|home)$',
  '^(undefined|def|sex|sexy|xxx|ted|larry)$',
  '^[.]+-cola$'
];

// ================================================================
// ================== Helpers =====================================
// ================================================================

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

var stranger = {
  is_stranger: true,
  data: { id: 0 },
  screen_name_ids: function () { return [0]; }
};

// ================================================================
// ================== Main Stuff ==================================
// ================================================================

var S = exports.Screen_Name = Ok.Model.new(function () {});

S.TABLE_NAME = TABLE_NAME;
S.expire_in = 4; // Refresh rate.

S.sub_type_ids = ['bot'];
S.sub_type_map = {};
_.each(S.sub_type_ids, function (v, i) {
  S.sub_type_map[i] = v;
});

S.INVALID_CHARS = INVALID_CHARS;

Website.require(exports);
Folder.screen_name(exports);

S._new = function () {
  var s = this;
  var n = s.data;
  s.is_screen_name = true;

  if (_.isString(n)) {
    s.screen_name = n;
    s.data        = {};
  } else if (n) {
    s.data        = n;
    s.screen_name = n.screen_name;
  }

  return s;
};

S.prototype.customer = function (c) {
  if (c)
    this._customer = c;
  return this._customer;
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


S.prototype.is_update_able = function () {
  return _.isEqual( this.customer().data.id, this.data.owner_id);
};

S.filter = function (sn) {
  return sn.replace(INVALID_CHARS, "");
};

S.to_url = function () {
  var args = _.toArray(arguments);
  var raw_sn = args.shift();
  var sn = S.filter(raw_sn);
  if (!sn.length)
    return null;

  args.unshift(sn);
  args.unshift('/me');
  return path.join.apply(path, args);
};

// ================================================================
// ================== Create Validators ===========================
// ================================================================

var Validate_Create = Check.new('create screen name', function (vc) {

  vc.define('read_able', function (vador) {
    vador.contains_only(['@W', '@P', '@N'], "Allowed values: @W (world) @P (private) @N (no one)");
  });

  vc.define('screen_name', function (v) {
    var orig = v.val;

    v
    .to_upper_case()
    .match(VALID_SCREEN_NAME, "Screen name must be: 4-15 valid chars: 0-9 a-z A-Z _ - .")
    ;

    _.each(banned_screen_names, function (pattern, i) {
      v.not_match(new RegExp(pattern, 'ig'), 'Screen name not allowed: ' + v.val);
    });

    v.update_sanitized_value_by_key('display_name', orig);
  });

  vc.define('type_id', function (v) {
    var val = v.val;
    if (_.isString(val))
      val = parseInt(val);
    if (!_.isNumber(val) || (val < 0) || val > 2)
      val = 0;
    v.update_sanitized_value(val);
  });

});


// ================================================================
// ================== Create ======================================
// ================================================================

S.create = function (customer, job) {

  var id = UID.create_id();
  var sn = S.new({});
  sn.new_data = customer.new_data;

  var insert_data = {};

  River.new(job)

  .job('validate', 'screen name', function (j) {
    Validate_Create.run(sn, j);
  })

  .job('create', 'screen name', function (j) {

    insert_data = {
      owner_id     : customer.data.id || 0,
      screen_name  : sn.sanitized_data.screen_name,
      display_name : sn.sanitized_data.screen_name,
      type_id      : sn.sanitized_data.type_id || 0
    };

    Topogo.new(TABLE_NAME)
    .on_dup("screen_name", function (name) {
      j.finish('invalid', 'Screen name already taken: ' + sn.new_data.screen_name);
    })
    .create(insert_data, j);

  })

  .job(function (j, r) {
    if (customer.data.id)
      return j.finish(r);

    // ==== This is a new customer
    // ==== so we must use the screen name id
    // ==== as the owner_id because customer record
    // ==== has not been created.
    River.new(j)
    .job('update owner _id', function (j2) {
      Topogo.new(TABLE_NAME).update_where_set(r.id, {owner_id: r.id}, j2);
    })
    .job('set customer id', function (j2, r) {
      customer.data.id = customer.sanitized_data.id = r.id;
      j.finish(r);
    })
    .run();

  })

  .job(function (j, r) {
    var data = _.extend(insert_data, r);
    customer.push_screen_name_row(data);
    return j.finish(S.new(data));
  })

  .run();

};

// ================================================================
// ================== Read ========================================
// ================================================================

S.prototype.is_world_read_able = function () {
  return _.contains(this.data.read_able || [], WORLD);
};

S.read_by_id = function (id, flow) {
  River.new(flow)
  .job('read screen name id:', id, function (j) {
    Topogo.new(TABLE_NAME).read_by_id(id, j);
  })
  .job(function (j, r) {
    return j.finish(S.new(r));
  })
  .run();
};

EVE.on('read life by screen name', function (flow) {
  var sn = flow.data.screen_name;
  EVE.run(flow, function (j) {
    Topogo.new(TABLE_NAME)
    .read_one({screen_name: sn.toUpperCase()}, j);
  }, function (j) {
    j.finish(S.new(j.last));
  });
});


S.find_screen_name_keys = function (arr) {
  var key = _.detect([ 'screen_name_id', 'publisher_id', 'owner_id', 'author_id', 'follower_id'], function (k) {
    return (arr[0] || '').hasOwnProperty(k);
  }) || 'screen_name_id';

  var new_key = key.replace('_id', '_screen_name');
  return [key, new_key];
};

S.attach_screen_names = function (arr, flow) {
  var keys = S.find_screen_name_keys(arr);
  var key = keys[0];
  var new_key = keys[1];

  var vals = _.pluck(arr, key);
  if (!vals.length)
    return flow.finish([]);

  River.new(flow)
  .job(function (j) {
    TABLE.read_list({id: vals}, j);
  })
  .job(function (j, names) {
    var map = {};
    _.each(names, function (n) {
      map[n.id] = n.screen_name;
    });

    _.each(arr, function (r, i) {
      arr[i][new_key] = map[arr[i][key]];
    });

    j.finish(arr);
  })
  .run();
};

S.replace_screen_names = function (arr, flow) {
  var keys = S.find_screen_name_keys(arr);
  var key = keys[0];
  var new_key = keys[1];

  River.new(flow)
  .job(function (j) {
    S.attach_screen_names(arr, j);
  })
  .job(function (j, new_arr) {
    _.each(new_arr, function (r, i) {
      new_arr[i][key] = undefined;
    });

    j.finish(new_arr);
  })
  .run();
};

S.read_list = function (c, flow) {
  River.new(arguments)
  .job('read screen names', c.data.id, function (j) {
    Topogo.new(TABLE_NAME)
    .read_list({owner_id: j.id}, j);
  })
  .job('push', 'screen_names', function (j, r) {
    _.each(r, function (row) {
      c.push_screen_name_row(row);
    });
    return j.finish(c);
  })
  .run();
};

S.prototype.read_screen_names = function (flow) {
  var me = this;

  River.new(arguments)

  .job('read screen names for:', me.data.id, function (j) {
    Topogo.new(TABLE_NAME).read_list({owner_id: j.id}, j);
  })

  .job(function (j, names) {
    if (!names.length)
      return flow.finish('not_valid', new Error('No screen names found for customer id: ' + me.data.id));

    me.data.screen_name_rows = null;

    _.each(names, function (v, k) {
      me.push_screen_name_row(v);
    });

    return j.finish(me);
  })

  .run();

};

// ================================================================
// =================== Update Validations =========================
// ================================================================


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


// ================================================================
// =================== Update =====================================
// ================================================================

var Validate_Update = Check.new('update screen name', function (vu) {

  vu.define('screen_name', Validate_Create.validations['screen_name']);

  vu.define('about', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });

  vu.define('type_id', Validate_Create);

  vu.define('nick_name', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });


});

S.update = function ( customer, flow ) {
  var me = S.new({});
  if (customer.new_data) {
    me.new_data = customer.new_data;
  } else {
    if (customer.owner)  {
      me.new_data = _.clone(customer);
      customer = me.new_data.owner;
      delete me.new_data.owner;
    } else {
      me.new_data = customer;
      customer = customer.owner;
    }
  }

  var row = customer.screen_name_row(me.new_data.old_screen_name || me.new_data.screen_name);

  if (!Validate_Update.run(me))
    return flow.invalid(me.errors);

  var set = {}, final_data = {};

  _.each('screen_name type_id about nick_name'.split(' '), function (key) {
    if (!me.sanitized_data.hasOwnProperty(key))
      return;

    switch (key) {

      case 'screen_name':
        if (me.new_data.old_screen_name) {
        set.screen_name = me.sanitized_data.screen_name;
        set.display_name = me.sanitized_data.display_name;
        final_data.old_screen_name = me.new_data.old_screen_name.toUpperCase();
      }
      break;

      default:
        set[key] = me.sanitized_data[key];

    };
  });

  if(set.settings)
    set.settings = JSON.stringify(set.settings);
  if(set.details)
    set.details  = JSON.stringify(set.details);

  River.new(arguments)
  .job('update screen name', me.data.screen_name, function (j) {
    Topogo.new(TABLE_NAME).update_where_set(row.id, set, j)
  })
  .job(function (j, row) {
    customer.push_screen_name_row(_.extend(set, row, final_data));
    return j.finish(customer);
  })
  .run();

};


// ================================================================
// =================== Trash/Delete ===============================
// ================================================================

S.untrash = function (id, flow) {
  Topogo.new(TABLE_NAME)
  .untrash(id, flow);
};

S.trash = function (id, flow) {
  Topogo.new(TABLE_NAME)
  .trash(id, flow);
};

S.delete_trashed = function (flow) {
  Topogo.new(TABLE_NAME)
  .delete_trashed(flow);
};

S.delete_by_owner_ids = function (arr, flow) {
  var sql = "DELETE FROM \"" + TABLE_NAME + "\" WHERE owner_id IN ( " +
    _.map(arr, function (n, i) { return "$" + (i + 1); }).join(', ') +
    " ) RETURNING * ;";

  Topogo
  .run(sql, arr, flow);
};




