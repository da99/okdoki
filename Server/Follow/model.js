
var _         = require("underscore")

, Follow      = require("./model").Follow
, Screen_Name = require("./model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
;

var Follow = exports.Follow = function () {};
var TABLE_NAME = exports.Follow.TABLE_NAME = "Follow";
var TABLE = Topogo.new(TABLE_NAME);

Follow.new = function (data) {
  var o = new Follow();
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
Follow.create_by_website = function (website, raw_data, flow) {
  var data = {
    website_id: website.data.id,
    follower_id: raw_data.follower_id
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, rows) {
    j.finish(Follow.new(rows[0]));
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










