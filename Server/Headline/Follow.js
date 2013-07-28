
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;


var Follow = exports.Follow = Ok.Model.new(function () {});

var TABLE_NAME = exports.Follow.TABLE_NAME = "Headline_Follow";
var TABLE = Topogo.new(TABLE_NAME);

Follow._new = function () {
  var o = this;
  return o;
};

// ================================================================
// ================== Helpers =====================================
// ================================================================

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
Follow.create = function (raw_data, flow) {
  var data = {
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, record) {
    j.finish(Follow.new(record));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================


// ================================================================
// ================== Update ======================================
// ================================================================

Follow.after_create_headline = function (headline, flow) {
  var d = headline.data;
  River.new(flow)
  .job('update author follow', function (j) {
    TABLE.update_one({owner: d.author, publisher: d.author},
                     {updated_at: '$now', last_read_at: '$now'}, j);
  })

  .job('create author follow if needed', function (j, last) {
    if (last)
      return j.finish(last);
    TABLE.create({owner: d.author, publisher: d.author}, j);
  })

  .job('update follows', function (j, last) {
    TABLE.update_where_set({publisher: d.author}, {last_read_at: '$now'}, j);
  })

  .job(function (j) {
    j.finish(headline);
  })

  .run();
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






