
// =======================================
// Tables:
//   Bot_For_Aud:
//     A creator can apply a bot to their publication
//     multiple times, with different settings and groups:
//
//        all pages   use Bot 1 - settings 1
//        all folders use Bot 1 - settings 2
//
//    Editors can also add uses to other's publications.
//
//
// =======================================
var _         = require("underscore")._

, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Bot_Use = Ok.Model.new(exports, 'Use');

var TABLE_NAME = exports.Use.TABLE_NAME = "Bot_Use";
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
  var sn = raw_data.bot.split('@');
  var data = {
    prefix: sn[0],
    publisher: sn[1],
    owner: raw_data.owner,
    TABLES: {T: "Screen_Name_Sub"}
  };

  River.new(flow)
  .job(function (j) {
    var sql = "\
      INSERT INTO @table (bot_id, owner)                    \n\
      SELECT id, @owner AS owner                            \n\
      FROM   @T                                             \n\
      WHERE  prefix = @prefix AND owner = @publisher        \n\
      RETURNING *                                           \n\
    ;";
    TABLE
    .run_and_return_at_most_1(sql, data, j);
  })
  .job(function (j, record) {
    j.finish(Bot_Use.new(_.extend({bot: raw_data.bot}, record)));
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






