
var _         = require("underscore")

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Feed = exports.Feed = Ok.Model.new(function () {});

var TABLE_NAME = exports.Feed.TABLE_NAME = "RSS_Feed";
var TABLE = Topogo.new(TABLE_NAME);

Feed._new = function () {
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
Feed.create = function (raw_data, flow) {
  var url = raw_data.url.trim();
  if (!url.match(/^https?/i))
    url = 'http://' + url;

  var data = {
    url: url
  };

  River.new(flow)
  .job(function (j) {
    TABLE
    .on_dup(TABLE_NAME + '_url', function (name) {
      TABLE.read(data, j);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Feed.new(record));
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






