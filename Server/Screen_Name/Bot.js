
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Bot = exports.Bot = Ok.Model.new(function () {});

var TABLE_NAME = exports.Bot.TABLE_NAME = "Screen_Name_Sub";
var TABLE = Topogo.new(TABLE_NAME);

Bot._new = function () {
  var o = this;
  return o;
};

Bot.prototype.public_data = function () {
  var me = this;
  return {
    prefix:me.data.prefix,
    owner: me.data.owner,
    screen_name: me.data.prefix + '@' + me.data.owner,
  };
};

// ================================================================
// ================== Helpers =====================================
// ================================================================

function extract_name(o) {
  if (o.screen_name)
    return H.canonize_screen_name(o.screen_name).split('@');
  return [o.prefix, o.owner];
}

// ================================================================
// ================== Create ======================================
// ================================================================
Bot.create = function (raw_data, flow) {
  var prefix = H.null_if_empty(raw_data.prefix.toLowerCase().replace(Screen_Name.INVALID_CHARS, '').slice(0,15));
  var owner  = H.null_if_empty(raw_data.owner);
  var sn     = prefix + '@' + owner;
  var data = {
    type_id     : 0,
    prefix      : prefix,
    owner       : owner
  };

  River.new(flow)
  .job(function (j) {
    TABLE
    .on_dup(function (constraint_name) {
      j.finish('invalid', "Name already taken: " + sn);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Bot.new(record));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

Bot.read_by_screen_name = function (sn, flow) {
  var pieces = sn.split('@');
  River.new(flow)
  .job('read', function (j) {
    TABLE.read_one({prefix: pieces[0], owner: pieces[1]}, j);
  })
  .job('to object', function (j, last) {
    j.finish(Bot.new(last));
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================
Bot.update = function (data, flow) {
  var clean = _.pick(data, 'code', 'about_me');
  var sn    = extract_name(data);

  if (clean.about_me)
    clean.about_me = H.null_if_empty(clean.about_me);

  if (clean.code)
    clean.code = H.null_if_empty(clean.code);

  if (clean.code && !H.is_json(clean.code))
    return flow.finish('invalid', 'Invalid code.');

  River.new(flow)
  .job('update', function (j) {
    TABLE.update_one({
      prefix: sn[0],
      owner: sn[1]
    }, clean, j);
  })
  .job('to object', function (j, row) {
    j.finish(Bot.new(row));
  })
  .run();
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






