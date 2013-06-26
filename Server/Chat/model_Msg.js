
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
;

var Msg        = exports.Msg = function () {};
var TABLE_NAME = "Chat_Msg";
var TABLE      = Topogo.new(TABLE_NAME);


Msg.new = function (data) {
  var o = new Seat();
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
Msg.create = function (raw_data, flow) {
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
Msg.read_list_by_room_and_author_ids = function (room, author_ids, flow) {
  River.new(flow)
  .job('read list', function (j) {
    TABLE.read_list({author_id: author_ids, chat_room_id: room.data.id}, j);
  })
  .job('replace author_id', function (j, rows) {
    Screen_Name.replace_screen_names(rows, j);
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================







