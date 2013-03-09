var Refresh = 4 // seconds
, _         = require('underscore')
, IM        = require('okdoki/lib/IM').IM
, Validate  = require('okdoki/lib/Validate').Validate
, Topogo    = require('okdoki/lib/Topogo').Topogo
, UID       = require('okdoki/lib/UID').UID
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

S.TABLE_NAME = TABLE_NAME;

S.expire_in = 4; // Refresh rate.

S.new = function (n) {
  var s         =  new S();
  if (_.isString(n) || !n) {
    s.screen_name = n;
    s.data        = {};
  } else if (n) {
    s.data        = n;
    s.screen_name = n.screen_name;
  }

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

var Validate_Create = Validate.new('create screen name', function (vc) {

  vc.define('read_able', function (vador) {
    vador.found_in(['W', 'P', 'N'],
                       "Allowed values: W (world) P (private) N (no one)");
  });

  vc.define('screen_name', function (v) {
    var orig = v.val;

    v
    .to_upper_case()
    .match(/^[A-Z0-9\-\_\.]{3,15}$/, "Screen name must be: 3-15 valid chars: 0-9 a-z A-Z _ - .")
    ;

    _.each(banned_screen_names, function (pattern, i) {
      v.not_match(new RegExp(pattern, 'ig'), 'Screen name not allowed: ' + v.val);
    });

    v.sanitized('display_name', orig);
  });

  vc.define('body', function (v) {
    var val = (v.val || '').trim();
    if (val.length === 0)
      val = '* * *';
    v.sanitized(val);
  });

});


// ****************************************************************
// ****************** Create **************************************
// ****************************************************************

S.create = function (customer, job) {

  var id = UID.create_id();
  var sn = S.new();
  sn.new_data = {'screen_name': customer.new_data.screen_name};

  var insert_data = {};

  River.new(job)

  .job('validate', 'screen name', function (j) {
    Validate_Create.validate(sn, j);
  })

  .job('create', 'screen name', function (j) {

    j.on_duplicate = function () {
      return job.invalid('Screen name already exists: ' + sn.new_data.screen_name);
    };

    insert_data = {
      id           : id,
      owner_id     : customer.data.id,
      screen_name  : sn.sanitized_data.screen_name,
      display_name : sn.sanitized_data.screen_name
    };

    Topogo.new(TABLE_NAME).create(insert_data, j);

  })

  .reply(function (r) {
    customer.push_screen_name_row(_.extend(insert_data, r));
    return customer;
  })

  .run();

};

// ****************************************************************
// ****************** Read ****************************************
// ****************************************************************

S.read_by_id = function (id, flow) {
  River.new(arguments)
  .job('read screen name id:', id, function (j) {
    Topogo.new(TABLE_NAME).read_by_id(id, j);
  })
  .reply(function (r) {
    return S.new(r);
  })
  .run();
};

S.read_by_screen_name = function (n, flow) {
  River.new(arguments)
  .job('read screen name:', n, function (j) {
    Topogo.new(TABLE_NAME).read_one_by_example({screen_name: n.toUpperCase()}, j)
  })
  .reply(function (r) {
    return S.new(r);
  })
  .run();
};

S.read_list = function (c, flow) {
  River.new(arguments)
  .job('read screen names', c.data.id, function (j) {
    Topogo.new(TABLE_NAME).read_by_example({owner_id: j.id}, j)
  })
  .reply(function (r) {
    _.each(r, function (row) {
      c.push_screen_name_row(row);
    });
    return c;
  })
  .run();
};

S.prototype.read_screen_names = function (flow) {
  var me = this;

  River.new(arguments)

  .job('read screen names for:', me.data.id, function (j) {
    Topogo.new(TABLE_NAME).read_by_example({owner_id: j.id}, j);
  })

  .reply(function (names) {
    if (!names.length)
      return flow.invalid(['No screen names found for customer id: ' + me.data.id]);

    me.data.screen_name_rows = null;

    _.each(names, function (v, k) {
      me.push_screen_name_row(v);
    });

  })

  .run();

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

var Validate_Update = Validate.new('update screen name', function (vu) {

  vu.define('read_able', Validate_Create);

  vu.define('screen_name', Validate_Create.validations['screen_name']);

  vu.define('about', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });

  vu.define('nick_name', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });

  vu.define('home-page-title', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });

});

S.update = function ( customer, flow ) {
  var me      = S.new();
  if (customer.new_data) {
    me.new_data = customer.new_data;
  } else {
    me.new_data = customer;
    customer = customer.owner;
  }

  var row = customer.screen_name_row(me.new_data.old_screen_name || me.new_data.screen_name);

  if (!Validate_Update.validate(me))
    return flow.invalid(me.errors);

  var set = {}, final_data = {};

  _.each('screen_name about nick_name home-page-title'.split(' '), function (key) {
    if (!me.sanitized_data.hasOwnProperty(key))
      return;

    switch (key) {
      case 'screen_name':
        set.screen_name = me.sanitized_data.screen_name;
      set.display_name = me.sanitized_data.display_name;
      final_data.old_screen_name = me.new_data.old_screen_name.toUpperCase();
      break;
      case 'home-page-title':
        if (!set.settings)
      set.settings = row.settings;
      set.settings[key] = me.sanitized_data[key];
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
    Topogo.new(TABLE_NAME).update(row.id, set, j)
  })
  .reply(function (row) {
    customer.push_screen_name_row(_.extend(set, row, final_data));
    return customer;
  })
  .run();

};


// ****************************************************************
// ******************* Trash/Delete *******************************
// ****************************************************************

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





