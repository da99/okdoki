
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
    TABLE
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

Room_Fav.read_for_customer = function (c, flow) {
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
         WHERE owner_id IN @owner_id; \n\
         ", {owner_id: c.screen_name_ids()}, j);
  })
  .job('attach screen names', function (j, records) {
    Screen_Name.replace_screen_names(records, j);
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






