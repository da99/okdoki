var _         = require('underscore')
, UID         = require('okdoki/lib/UID').UID
, SQL         = require('okdoki/lib/SQL').SQL
, PG          = require('okdoki/lib/PG').PG
, River       = require('okdoki/lib/River').River
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
;

var IM = exports.IM = function () {};

// ****************************************************************
// ****************** Helpers & Configs ***************************
// ****************************************************************

var TABLE_NAME        = IM.TABLE_NAME  = 'ims';
IM.expire_in          = 4; // default
IM.pattern_whitespace = /\s+/ig;
IM.keys = "to_id from_id body labels client_id id ref_client_id ref_id".split(" ");

IM.uniq_str = function() {
  var args    = _.toArray(arguments);
  var str     = _.compact(args).join(" ");
  var labels  = str.split(IM.pattern_whitespace);
  var trimmed = _.map(labels, function(v){
    return v.trim();
  });
  var labels_str = _.uniq(trimmed).join(' ').trim();

  return labels_str;
};

// ****************************************************************
// ****************** Create **************************************
// ****************************************************************


IM.new = function (data) {
  var im        = new IM();
  im.data       = {};
  im.other_data = {};

  _.each(data, function (v, k) {
    if (_.contains(IM.keys, k)) {

      if (_.isFunction(v))
        v = v(im);

      if (im[k]) {
        im[k](v);
      } else {
        im.data[k] = v;
      }

    } else {
      im.other_data[k] = v;
    }
  });

  if (!im.data.id)
    im.data.id = UID.generate_id(im.from_id);

  return im;
};

_.each(IM.keys, function (v) {
  IM.prototype[v] = function () {
    var me = this;
    var this_name = v;
    if (arguments.length === 0)
      return me.data[v];
    me.data[v] = arguments[0];
    return me;
  }
});

IM.prototype.body = function (v) {
  var me = this;
  if (arguments.length === 0)
    return me.data.body;

  me.data.body = (v || "").trim();

  return me.data.body;
};

_.each(['labels', 'to_id'], function(name){
  IM.prototype[name] = function () {
    var me = this;
    var k = name;
    if (arguments.length === 0)
      return me.data[k];
    me.data[k] = IM.uniq_str(me.data[k], arguments[0]);
    return me;
  }
});

IM.create = function (o, flow) {

  var im  = IM.new(o);

  River.new(flow)

  .job('read screen_name', im.other_data.from, function (j) {
    Screen_Name.read_by_screen_name(im.other_data.from, j)
  })

  .job('save im', function (j, sn) {

    im.from_id(sn.data.id);

    // Create msg record w/ expire.
    PG.new('create im', j)
    .q(SQL.insert_into(IM.TABLE_NAME).values(im.data))
    .run()

  })

  .reply(function (r) {
    return( IM.new(r) );
  })

  .run();

}; // end .create

// ****************************************************************
// ****************** Read ****************************************
// ****************************************************************


//
// Read a list of ims sent to a customer
// by a reflected contact.
//
IM.read_list = function (customer, flow) {
  var sql = "\
    WITH allowed_contacts as (                      \
      SELECT to_id                                  \
      FROM   contacts                               \
      WHERE  from_id = $1 AND trashed_at IS NULL    \
    )                                               \
    SELECT                                          \
       to_sn.screen_name   AS to,                   \
       from_sn.screen_name AS from,                 \
       body,                                        \
       client_id,                                   \
       re_client_id,                                \
       ims.id                                       \
    FROM ims                                        \
        LEFT JOIN screen_names from_sn              \
          ON ims.from_id = from_sn.id               \
        LEFT JOIN screen_names to_sn                \
          ON ims.to_id = to_sn.id                   \
                                                    \
    WHERE (ims.from_id = '[OKDOKI]' OR ims.from_id IN (SELECT * FROM allowed_contacts))  \
          AND ims.created_at >= " + SQL.now_minus('4 seconds') + "   \
  ;";

  PG.new(flow)
  .q(sql, [customer.data.id])
  .run();
};







