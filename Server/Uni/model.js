
var _         = require('underscore')
, Check       = require('da_check').Check
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
, Customer    = require('../Customer/model').Customer
, Screen_Name = require('../Screen_Name/model').Screen_Name
, h           = require('../App/base')
;

var Uni  = exports.Uni = function () {};
var TABLE_NAME = Uni.TABLE_NAME = 'Uni';
var TABLE      = Uni.TABLE = Topogo.new(TABLE_NAME);

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
});

Uni.create = function (vals, flow) {
  var me = Uni.new();
  me.new_data = vals;

  if (!Validate_Create.run(me))
    return flow.invalid(me.errors);

  var id_data  = {};
  var new_data = me.sanitized_data;
  h.move_keys(id_data, new_data, 'owner', 'screen_name');

  River.new(flow)
  .job('create table', id_data.screen_name, function (j) {
    TABLE.create(new_data, j);
  })
  .job('read table', id_data.screen_name, function (j, row) {
    Uni.read( _.extend({from: id_data['owner']}, id_data, new_data, row), j );
  })
  .run();
};


// ================================================================
// ================== Read ========================================
// ================================================================

Uni.read = function (vals, flow) {
  var from        = vals.from;
  var screen_name = vals.screen_name;

  if (from.is(screen_name)) {
    var to_id = from.screen_name_id(screen_name);
    var sql = " \
      SELECT *                   \
      FROM \"" + TABLE_NAME + "\"                  \
      WHERE                      \
          owner_id = $1          \
      LIMIT 1                    \
    ;";

    River.new(arguments)
    .job_must_find('Homepage', to_id, function (j) {
      TABLE.read_one({owner_id: to_id}, j);
    })
    .job(function (j, row) {
      var new_vals = _.extend({from: from}, row || {});
      return j.finish(Uni.new(new_vals));
    })
    .run();

    return;
  }

  var vals = [screen_name];
  var sql = "\
    SELECT $uni.title, $uni.about        \
    FROM $sn LEFT JOIN $uni               \
      ON $sn.id = $uni.owner_id     \
        AND $sn.screen_name = UPPER($1)   \
      LEFT JOIN $sn from                  \
        ON from.screen_name = UPPER($2)            \
    WHERE                                          \
      (                                            \
         $sn.read_able = 'W'                       \
         OR                                        \
         from.id = ANY $sn.read_able_list          \
      )                                            \
      AND from.id != ANY $sn.un_read_able_list     \
    LIMIT 1                                        \
  ;"
  .replace(/\$sn/g, '"' + Screen_Name.TABLE_NAME + '"')
  .replace(/\$uni/g, '"' + Uni.TABLE_NAME + '"')
  ;

  PG.new(flow)
  .q({sql: sql, vals: vals, limit_1: true})
  .reply(function (row) {
    return Uni.new(row);
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



