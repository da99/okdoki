
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, log         = require("../App/base").log
;

var Seat       = exports.Seat = function () {};
var TABLE_NAME = "Chat_Screen_Name";
var TABLE      = Topogo.new(TABLE_NAME);

Seat.MAX_TIME = 3;
Seat.new = function (data) {
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
Seat.create_by_room = function (room, flow) {
  var data = {
    chat_room_id : room.data.id,
    screen_name_id: room.screen_name().customer().data.id
  };

                 // "UPDATE @table " +
              // "SET last_seen_at = $now " +
              // "WHERE chat_room_id = $",
              // "RETURNING * ;",
  River.new(flow)
  .job('update', function (j) {
    TABLE.update(data, {last_seen_at: '$now'}, j);
  })
  .job(function (j, rows) {
    if (rows.length > 0)
      return j.finish(rows[0]);

    TABLE.create(data, j);
  })
  .job(function (j, rec) {
    j.finish(Seat.new(rec));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================
Seat.read_list_by_room = function (room, flow) {
  var now = (new Date).getTime();
  var target = now - (1000 * 3);

  var data = {
    chat_room_id: room.data.id
  };

  River.new(flow)

  .job('read seats', function (j) {
    TABLE.read_list(data, j);
  })

  .job('attach screen names', function (j, rows) {
    Screen_Name.replace_screen_names(rows, j);
  })

  .job('set old', function (j, rows) {
    j.finish(_.map(rows, function (r) {
      var is_out = !r.last_seen_at || (r.last_seen_at.getTime() < (target));
      return { screen_name: r.screen_name, is_out: is_out };
    }));
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







