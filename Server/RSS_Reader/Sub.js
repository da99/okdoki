
var _         = require("underscore")

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Feed        = require("./Feed").Feed
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Sub = exports.Sub = Ok.Model.new(function () {});

var TABLE_NAME = exports.Sub.TABLE_NAME = "RSS_Sub";
var TABLE = Topogo.new(TABLE_NAME);

Sub._new = function () {
  var o = this;
  return o;
};

function trunc(str) {
  str = str.trim();
  if (str.length < 100)
    return str;
  return str.slice(0,96) + '...';
}
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
Sub.create = function (raw_data, flow) {
  var link  = raw_data.link;
  var owner = raw_data.owner;

  River.new(flow)
  .job('create feed', function (j) {
    Feed.create({link: link}, j);
  })
  .job('create sub', function (j, feed) {
    var data = {
      feed_id   : feed.data.id,
      nick_name : trunc(feed.data.title),
      owner     : owner
    };
    TABLE
    .on_dup(TABLE_NAME + '_owner_and_feed_id', function (name) {
      TABLE.read_one({owner: data.owner, feed_id: data.feed_id}, j);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Sub.new(record));
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






