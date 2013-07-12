
var _         = require("underscore")
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Chat_Room_Seat=require("../Chat/Room_Seat").Room_Seat
, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, log         = require("../App/base").log
;

var e_e_e = require('escape_escape_escape').Sanitize.html;

var Msg        = exports.Room_Msg = function () {};
var TABLE_NAME = "Chat_Room_Msg";
var TABLE      = Topogo.new(TABLE_NAME);


Msg.new = function (data) {
  if (arguments.length && !data)
    return null;

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

Msg.prototype.public_data = function () {
  return public_data(this.data);
};

function public_data(r) {
  return {
    created_at_epoch : r.created_at.getTime(),
    dom_id           : 'm' + r.id + '_' + r.created_at.getTime(),
    chat_room        : r.chat_room,
    author           : r.author,
    body             : r.body,
    created_at       : r.created_at
  };
};

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
    chat_room : seat.data.chat_room,
    author    : seat.data.owner,
    body      : e_e_e(body)
  };
  River.new(flow)
  .job('create', function (j) {
    TABLE.create(data, j);
  })
  .job('new obj', function (j, row) {
    j.finish( Msg.new(row) );
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================
Msg.read_list_for_customer = function (customer, flow) {
  River.new(flow)

  .job('read chat room seat list', function (j) {
    Chat_Room_Seat.read_list_for_customer(customer, j);
  })

  .job('map', function (j, list) {
    j.finish(_.map(list, function (s) {
      return s.chat_room;
    }));
  })

  .job('read list', function (j, list) {
    var sql = "\
      SELECT id, author, chat_room, body, created_at       \n\
      FROM @table                                          \n\
      WHERE chat_room  IN  @chat_rooms                     \n\
        AND created_at >=  (now() - INTERVAL '5 seconds')  \n\
    ;";
    TABLE.run(sql, {chat_rooms: list}, j);
  })

  .job('add epoch', function (j, rows) {
    j.finish(_.map(rows, public_data));
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







