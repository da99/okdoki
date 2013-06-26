
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, log         = require("../App/base").log
;

var Msg        = exports.Msg = function () {};
var TABLE_NAME = "Chat_Msg";
var TABLE      = Topogo.new(TABLE_NAME);


Msg.new = function (data) {
  var o = new Msg();
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

Msg.create_by_seat_and_body = function (seat, body, flow) {
  var data = {
    chat_room_id : seat.data.chat_room_id,
    author_id    : seat.data.screen_name_id,
    body         : body
  };
  River.new(flow)
  .job('create', function (j) {
    TABLE.create(data, j);
  })
  .job('new obj', function (j, row) {
    if (!row)
      return j.finish(null);
    j.finish( Msg.new(row) );
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================
Msg.read_list_by_room_and_last_created_at = function (room, raw_last_time, flow) {
  if (!raw_last_time)
    raw_last_time = (new Date).getTime();

  var last_time = new Date((new Date(parseInt(raw_last_time))).getTime() - (1000 * 9));

  River.new(flow)
  .job('read list', function (j) {
    var sql = "\
      SELECT id, author_id, body, created_at \n\
      FROM @table                            \n\
      WHERE chat_room_id = @chat_room_id     \n\
        AND created_at >= @last_time         \n\
    ;";
    TABLE.run(sql, {chat_room_id: room.data.id, last_time: last_time}, j);
  })
  .job('add epoch', function (j, rows) {
    j.finish(_.map(rows, function (r) {
      r.created_at_epoch = r.created_at.getTime();
      return r;
    }));
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







