
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
;


var Room = exports.Room = function () {};
var TABLE_NAME = exports.Room.TABLE_NAME = "Chat";
var TABLE = Topogo.new(TABLE_NAME);

Chat.new = function (data) {
  var o = new Chat();
  o.data = data;
  return o;
};

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
Chat.create = function (raw_data, flow) {
  var data = {
  };

  var sql = "";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .job(function (j, rows) {
    j.finish(Chat.new(rows[0]));
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






