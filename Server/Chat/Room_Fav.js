
var _         = require("underscore")

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Room_Fav = exports.Room_Fav = Ok.Model.new(function () {});

var TABLE_NAME = exports.Room_Fav.TABLE_NAME = "Chat_Room_Fav";
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

  var name = raw_data.chat_room_screen_name.trim().toUpperCase();
  var data = {
    owner_id              : raw_data.owner_id,
    chat_room_screen_name : name
  };

  River.new(flow)
  .job(function (j) {
    Topogo.new("Chat_Room_Fav")
    .on_dup('owner_id_to_chat_room_screen_name', function (index_name) {
      j.finish('invalid', 'Chat room already in your list: ' + name);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Room_Fav.new(record));
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






