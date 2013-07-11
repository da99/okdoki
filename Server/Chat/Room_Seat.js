
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Room_Seat  = exports.Room_Seat = Ok.Model.new(function () {});
var MAX_TIME   = Room_Seat.MAX_TIME = 4;

var TABLE_NAME = exports.Room_Seat.TABLE_NAME = "Room_Seat";
var TABLE      = Topogo.new(TABLE_NAME);

Room_Seat._new = function () {
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

Room_Seat.prototype.max_time = function () {
  return MAX_TIME;
};

// ================================================================
// ================== Create ======================================
// ================================================================
Room_Seat.create = function (raw_data, flow) {
  var data = {
    chat_room_screen_name: raw_data.chat_room_screen_name.trim().toUpperCase(),
    owner_screen_name    : raw_data.owner_screen_name.trim().toUpperCase()
  };

  River.new(flow)
  .job('update', function (j) {
    data['last_seen_at'] = '$now';
    TABLE.update(data, _.extend({last_seen_at: '$now'}, data), j);
  })
  .job(function (j, r) {
    if (r)
      return j.finish(r);
    TABLE.create(data, j);
  })
  .job(function (j, record) {
    j.finish(Room_Seat.new(record));
  })
  .run();
};

Room_Seat.create_by_room = function (room, flow) {
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
    j.finish(Room_Seat.new(rec));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

Room_Seat.read_by_room_and_screen_name_id = function (room, sn_id, flow) {
  var data = {
    chat_room_id: room.data.id,
    screen_name_id: sn_id
  };
  River.new(flow)
  .job('read', function (j) {
    TABLE.read_one(data, j);
  })
  .job('new obj', function (j, row) {
    if (!row)
      return j.finish(null);
    j.finish(Room_Seat.new(row));
  })
  .run();
};

Room_Seat.read_list_by_room = function (room, flow) {
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

Room_Seat.read_for_customer = function (c, flow) {
  throw new Error("No finished importing from Room_Fav");
  var names = _.map(c.screen_names(), function (n) {
    return {
      owner_screen_name     : n,
      chat_room_screen_name : n
    };
  });

  River.new(flow)
  .job('read favs', function (j) {
    TABLE
    .run( "\n\
         SELECT * FROM @table         \n\
         WHERE owner_screen_name IN @owner_screen_names; \n\
         ", {owner_screen_names: c.screen_names()}, j);
  })
  .job('map and reverse', function (j, records){
    j.finish(_.map(records, function (n) {
      return {
        owner_screen_name     : n.owner_screen_name,
        chat_room_screen_name : n.chat_room_screen_name
      };
    }).reverse());
  })
  .job('combine and return', function (j, rows) {
    j.finish(names.concat(rows));
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






