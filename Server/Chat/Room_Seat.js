
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

var TABLE_NAME = exports.Room_Seat.TABLE_NAME = "Chat_Room_Seat";
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

Room_Seat.prototype.public_data = function (o) {
  return _.pick(this.data, 'chat_room', 'owner', 'last_seen_at', 'is_empty' );
};

// ================================================================
// ================== Create ======================================
// ================================================================

Room_Seat.create_by_chat_room_and_owner = function (room, life, flow) {
  var where = {
    chat_room: room,
    owner    : life
  };

  River.new(flow)
  .job('read screen name', function (j) {
    Screen_Name.read_by_screen_name(room, j);
  })
  .job('create', function (j, screen_name) {
    if (!screen_name)
      return j.finish('invalid', "Chat room does not exist: " + room);

    TABLE
    .on_dup(TABLE_NAME + '_seat', function (name) {
      j.finish(null);
    })
    .create(where, j);
  })
  .job('read', function (j, row) {
    if (row)
      return j.finish(row);
    TABLE.read_one(where, j);
  })
  .job(function (j, row) {
    j.finish(Room_Seat.new(row));
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

Room_Seat.read_and_require_filled = function (chat_room, user, flow) {
  River.new(flow)
  .job('read', function (j) {
    TABLE
    .read_one({
      chat_room: chat_room,
      owner: user.screen_names(),
      is_empty: 'f'
    }, j);
  })
  .job('new obj', function (j, seat) {
    if (seat)
      return j.finish(Room_Seat.new(seat));
    j.finish('not_found', "You're not in the room: " + chat_room);
  })
  .run();
};

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

Room_Seat.read_chatter_list = function (seat, flow) {

  var data = {
    chat_room: seat.data.chat_room,
    owner    : seat.data.owner
  };

  River.new(flow)

  .job('read seats', function (j) {
    var sql = "\
      SELECT owner                                           \n\
      FROM @table                                            \n\
      WHERE chat_room = @chat_room                           \n\
        AND last_seen_at > (now() - INTERVAL '4 seconds')    \n\
        AND owner != @owner                                  \n\
        AND is_empty = false                                 \n\
    ;";
    TABLE
    .run(sql, data, j);
  })

  .job('map', function (j, rows) {
    j.finish(_.pluck(rows, 'owner'));
  })

  .run();
};

Room_Seat.read_list_for_customer = function (c, flow) {
  var names = _.map(c.screen_names(), function (n) {
    return {
      owner     : n,
      chat_room : n
    };
  });

  River.new(flow)
  .job('read seats', function (j) {
    TABLE
    .run( "\n\
         SELECT * FROM @table               \n\
         WHERE owner IN @owners             \n\
           AND chat_room NOT IN @owners     \n\
         ;", {owners: c.screen_names()}, j);
  })
  .job('map and reverse', function (j, records){
    j.finish(_.map(records, function (n) {
      return {
        owner     : n.owner,
        chat_room : n.chat_room
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
Room_Seat.enter = function (room, life, flow) {
  River.new(flow)
  .job('read', function (j) {
    TABLE
    .update_one({chat_room: room, owner: life},
            {last_seen_at: '$now', is_empty: 'f'}, j);
  })
  .job('create', function (j, row) {
    if (row)
      return j.finish(row);
    if (room !== life)
      return j.finish(null);

    // === If it does not not exist,
    //     leave this flow, create, then enter.
    River.new(flow)
    .job(function (j) {
      Room_Seat.create_by_chat_room_and_owner(room, life, j);
    })
    .job(function (j) {
      Room_Seat.enter(room, life, j);
    })
    .run();

  })
  .job(function (j, row) {
    j.finish(Room_Seat.new(row));
  })
  .run();
};

Room_Seat.leave = function (chat_room, life, flow) {
  River.new(flow)
  .job('update', function (j) {
    TABLE
    .update_one({
      chat_room: chat_room,
      owner: life
    }, {last_seen_at: '$now', is_empty: 't'}, j);
  })
  .run(function (j, row) {
    j.finish(Room_Seat.new(row));
  });
};


Room_Seat.update_disconnected_chatters = function () {
  var sql = "\
    UPDATE @table                \n\
    SET  is_empty = 't'          \n\
    WHERE is_empty = 'f'         \n\
      AND last_seen_at < (now() - INTERVAL '3 seconds')      \n\
    RETURNING chat_room, owner                               \n\
  ;";

  River.new()
  .job('find and update', function (j) {
    TABLE.run(sql, {}, j);
  })
  .job('announce', function (j, seats) {
    if (!seats.length)
      return j.finish(seats);
    var rooms = {};
    _.each(seats, function (r) {
      if (!rooms[r.chat_room])
        rooms[r.chat_room] = [];
      rooms[r.chat_room].push(r.owner);
    });

    var river = River.new(j);

    _.each(rooms, function (arr, chat_room) {
      river.job(chat_room, function (j2) {
        Chat_Room_Msg.create_official(chat_room, "Disconnected: " + arr.join(', '), j2);
      });
    });

    river.run();
  })
  .run(function (fin, last) {
    log(last);
  });
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






