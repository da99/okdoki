
var _         = require("underscore")._

, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
, F           = require('tally_ho').Tally_Ho
;


var Code = Ok.Model.new(exports, 'Bot_Code');

var TABLE_NAME = Code.TABLE_NAME = "Bot_Code";
var TABLE = Topogo.new(TABLE_NAME);

Code.types = [
  'settings',
  'all',
  'multi_life',
  'life'
];

Code._new = function () {
  var o = this;
  return o;
};

// ================================================================
// ================== Helpers =====================================
// ================================================================



// ================================================================
// ================== Create ======================================
// ================================================================
Code.create = function (raw_data, flow) {
  var data = {
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, record) {
    j.finish(Code.new(record));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

F.on('after read Bot by screen name', function (f) {

  var bot = f.val;

  F.run(function (f2) {
    var sql = "\
      SELECT *                         \n\
      FROM @table                      \n\
      WHERE bot_id = @BOT_ID           \n\
                                       \n\
    ";
    TABLE.run(sql, {BOT_ID: bot.data.id}, f2);
  }, function (f2) {
    bot.Code = Bot_Code.new(f2.last);
    f.finish();
  });

});

// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






