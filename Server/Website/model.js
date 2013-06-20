
var _         = require('underscore')
, Check       = require('da_check').Check
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
, Customer    = require('../Customer/model').Customer
, Screen_Name = null
, h           = require('../App/base')
;

var Uni  = exports.Website = function () {};
var TABLE_NAME = Uni.TABLE_NAME = 'Website';
var TABLE      = Uni.TABLE = Topogo.new(TABLE_NAME);

Uni.TYPE_IDS = {1: "Screen Name Profile Website"};

Uni.require = function (target) {
  if (target.Screen_Name)
    return Screen_Name = target.Screen_Name;
  throw new Error("Unknown type: " + exports);
};

Uni.new = function (row) {

  var hp = new Uni();
  hp.data = {id: null, owner_id: null, title: null, about: null, };

  if (row) {
    hp.owner = row.owner;
    _.each(row, function (v, k) {
      if (hp.data.hasOwnProperty(k))
        hp.data[k] = v;
    });
  }

  hp.is_new = !!hp.data.id;
  return hp;

};


// ================================================================
// ================== Create ======================================
// ================================================================

var Validate_Create = Check.new('create home page', function (vc) {
  vc.define('title', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('about', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('screen_name', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('owner', function (vador) {
    vador.is_null_if_empty();
    if (vador.val)
      vador.sanitized('owner_id', vador.val.screen_name_id(vador.target.new_data['screen_name']));
  });

  vc.define('type_id', function (vador) {
    vador.between(1,100); //, "Invalid website type.");
  });

  vc.define('owner_id', function (vador) {
    if (vador.val)
      vador.not_empty("Invalid owner.");
  });
});

Uni.create = function (vals, flow) {
  var me = Uni.new();
  me.new_data = vals;

  if (!Validate_Create.run(me))
    return flow.finish('invalid', me.errors);

  River.new(flow)
  .job('create', function (j) {
    TABLE.create(me.sanitized_data, j);
  })
  .job('read', function (j, row) {
    Uni.read( row.id, j );
  })
  .run();
};


// ================================================================
// ================== Read ========================================
// ================================================================

Uni.read = function (q, flow) {
  if (!_.isObject(q))
    q = {id: q, trashed_at: null};

  River.new(flow)
  .job(function (j) {
    TABLE.read_one(q, j);
  })
  .job(function (j, last) {
    j.finish(Uni.new(last));
  })
  .run();
};

Uni.read_by_screen_name = function (sn, customer, flow) {
  var vals = {
    type_id: 1,
    upper_sn: sn.toUpperCase(),
    sn_ids: customer.screen_name_ids(),
    TABLES: {
      SN: Screen_Name.TABLE_NAME,
      W: TABLE_NAME
    }
  };

  var sql = "\
  SELECT                                                                   \n\
    @W.*,                                                                  \n\
    @SN.id AS screen_name_id                                               \n\
  FROM                                                                     \n\
    @W INNER JOIN @SN ON @W.owner_id = @SN.id                              \n\
  WHERE                                                                    \n\
    " + Topogo.where_readable(vals.TABLES) + "                             \n\
    AND @SN.screen_name = @upper_sn                                        \n\
    AND @W.type_id = @type_id                                              \n\
                                                                           \n\
  LIMIT 1                                                                  \n\
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, vals, j);
  })
  .job(function (j, unis) {
    j.finish(_.map(unis, function (u) {
      return Uni.new(u);
    }));
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================

var Validate_Update = Check.new('update home page', function (vc) {
  vc.define('owner', Validate_Create);
  vc.define('screen_name', Validate_Create);
  vc.define('title', Validate_Create);
  vc.define('about', Validate_Create);
});

Uni.update = function (vals, flow) {
  var me = Uni.new();
  me.new_data = vals;

  if(!Validate_Update.run(me))
    return flow.invalid(me.errors);

  var where         = {};
  var updated_vals  = me.sanitized_data;
  h.move_keys(where, updated_vals, 'owner owner_id screen_name'.split(' '));


  River.new(arguments)

  .job('update', where.screen_name, function (j) {
    TABLE.update({owner_id: where.owner_id}, updated_vals, j);
  })

  .job('create if no found', where.screen_name, function (j) {
    var last_reply = j.river.last_reply();
    if (last_reply.length === 0)
      Uni.create(_.extend({}, where, updated_vals), j);
    else
      j.finish(last_reply[0]);
  })

  .job(function (j, last) {
    j.finish( Uni.new(last) );
  })

  .run();

};



// ===== READ ONE
  // var sql = "\
    // SELECT $uni.title, $uni.about        \
    // FROM $sn LEFT JOIN $uni               \
      // ON $sn.id = $uni.owner_id     \
        // AND $sn.screen_name = UPPER($1)   \
      // LEFT JOIN $sn from                  \
        // ON from.screen_name = UPPER($2)            \
    // WHERE                                          \
      // (                                            \
         // $sn.read_able = 'W'                       \
         // OR                                        \
         // from.id = ANY $sn.read_able_list          \
      // )                                            \
      // AND from.id != ANY $sn.un_read_able_list     \
    // LIMIT 1                                        \
  // ;"
  // .replace(/\$sn/g, '"' + Screen_Name.TABLE_NAME + '"')
  // .replace(/\$uni/g, '"' + Uni.TABLE_NAME + '"')
  // ;
