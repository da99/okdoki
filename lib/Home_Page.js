
var _         = require('underscore')
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Validate    = require('okdoki/lib/Validate').Validate
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
, River       = require('okdoki/lib/River').River
;

var Home_Page  = exports.Home_Page = function () {};
var TABLE_NAME = Home_Page.TABLE_NAME = 'home_pages';

Home_Page.new = function (row) {

  var hp = new Home_Page();
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


// ****************************************************************
// ****************** Create **************************************
// ****************************************************************

var Validate_Create = Validate.new('create home page', function (vc) {
  vc.define('title', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('about', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('screen_name', function (vador) {
    vador.is_null_if_empty();
  });

  vc.define('from', function (vador) {
    vador.is_null_if_empty();
    if (vador.val)
      vador.sanitized('owner_id', vador.val.screen_name_id(vador.target.new_data['screen_name']));
  });
});

Home_Page.create = function (vals, flow) {
  var me = Home_Page.new();
  me.new_data = vals;

  if (!Validate_Create.validate(me))
    return flow.invalid(me.errors);

  var id_data = _.pick(me.sanitized_data, 'from', 'screen_name');
  var new_data = me.sanitized_data;
  delete new_data['from'];
  delete new_data['screen_name'];

  PG.new(flow)
  .insert_into(TABLE_NAME)
  .values(new_data)
  .run_and_on_finish(function (row) {
    Home_Page.read( _.extend({}, id_data, new_data, row), flow );
  });
};


// ****************************************************************
// ****************** Read ****************************************
// ****************************************************************

Home_Page.read = function (vals, flow) {
  var from           = vals.from;
  var to_screen_name = vals.to || vals.to_screen_name || vals.screen_name;

  if (from.is(to_screen_name)) {
    var to_id = from.screen_name_id(to_screen_name);
    var sql = " \
      SELECT home_page.*         \
      FROM home_pages            \
      WHERE                      \
        home_pages.owner_id = $1 \
      LIMIT 1                    \
    ;";

    PG.new('read home page ' + to_screen_name, flow)
    .q(SQL.select('*').from(TABLE_NAME).where('owner_id', to_id))
    .run_and_on_finish(function (rows) {
      var new_vals = _.extend({owner: from}, rows[0] || {});
      flow.finish( Home_Page.new(new_vals) );
    });

    return;
  }

  var vals = [to_screen_name];
  var sql = "\
    SELECT home_page.title, home_page.about        \
    FROM $sn LEFT JOIN home_pages         \
      ON $sn.id = home_pages.owner_id     \
        AND $sn.screen_name = UPPER($1)   \
      LEFT JOIN $sn from                  \
        ON from.screen_name = UPPER($2)           \
    WHERE                                          \
      (                                            \
         $sn.read_able = 'W'              \
         OR                                        \
         from.id = ANY $sn.read_able_list \
      )                                            \
      AND from.id != ANY $sn.un_read_able_list \
    LIMIT 1                                        \
  ;".replace(/\$sn/g, Screen_Name.TABLE_NAME);

  PG.new(flow)
  .q({sql: sql, vals: vals, limit_1: true})
  .run_and_on_finish(function (row) {
    flow.finish(Home_Page.new(row));
  });
};


// ****************************************************************
// ****************** Update **************************************
// ****************************************************************

var Validate_Update = Validate.new('update home page', function (vc) {
  vc.define('from', Validate_Create);
  vc.define('screen_name', Validate_Create);
  vc.define('title', Validate_Create);
  vc.define('about', Validate_Create);
});

Home_Page.update = function (vals, flow) {
  var me = Home_Page.new();
  me.new_data = vals;

  if(!Validate_Update.validate(me))
    return flow.invalid(me.errors);

  var where         = {};
  _.each('from owner_id screen_name'.split(' '), function (k) {
    where[k]       = me.sanitized_data[k];
    delete me.sanitized_data[k];
  });

  var updated_vals  = me.sanitized_data;

  River.new(flow)

  .continue_on_job('not_found', 'create home page', where.screen_name, function (j) {
    Home_Page.create(_.extend({}, where, updated_vals), j);
  })

  .job('update', where.screen_name, function (j) {
    PG.new('update: ' + j.id, j)
    .update(TABLE_NAME)
    .set(updated_vals)
    .where('owner_id', where.owner_id)
    .run();
  })

  .run_and_on_finish(function (r) {
    flow.finish(Home_Page.new(r.last_reply()));
  });

};


