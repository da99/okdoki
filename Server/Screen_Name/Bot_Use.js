
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Bot_Use = exports.Bot_Use = Ok.Model.new(function () {});

var TABLE_NAME = exports.Bot_Use.TABLE_NAME = "Bot_Use";
var TABLE = Topogo.new(TABLE_NAME);

Bot_Use._new = function () {
  var o = this;
  return o;
};

Bot_Use.prototype.public_data = function () {
  var me = this;
  return {
    bot: me.data.bot,
    owner: me.data.owner,
    screen_name: me.data.bot
  };
};

// ================================================================
// ================== Helpers =====================================
// ================================================================



// ================================================================
// ================== Create ======================================
// ================================================================
Bot_Use.create = function (raw_data, flow) {
  var data = {
    bot: raw_data.bot,
    owner: raw_data.owner
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, record) {
    j.finish(Bot_Use.new(record));
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






