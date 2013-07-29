
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
, Canon_SN    = require("../../Client/js/Screen_Name").canonize_screen_name
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
    owner: me.data.owner,
    screen_name: me.data.prefix + '@' + me.data.owner,
  };
};

// ================================================================
// ================== Helpers =====================================
// ================================================================

function null_if_empty(str) {
  if (!str) return null;
  str = str.trim();
  if (!str.length)
    return null;
  return str;
}

// ================================================================
// ================== Create ======================================
// ================================================================
Bot.create = function (raw_data, flow) {
  var prefix = null_if_empty(raw_data.prefix.toLowerCase().replace(Screen_Name.INVALID_CHARS, '').slice(0,15));
  var owner  = null_if_empty(raw_data.owner);
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


// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






