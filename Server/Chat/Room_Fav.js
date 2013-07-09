
var _         = require("underscore")

, Room_Fav       = require("./model").Room_Fav
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Room_Fav = exports.Room_Fav = Ok.Model.new(function () {});

var TABLE_NAME = exports.Room_Fav.TABLE_NAME = "Room_Fav";
var TABLE = Topogo.new(TABLE_NAME);

Room_Fav._new = function () {
  var o = this;
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
Room_Fav.create = function (raw_data, flow) {
  var data = {
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, rows) {
    j.finish(Room_Fav.new(rows[0]));
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






