
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Check       = require('da_check').Check
, River       = require('da_river').River
, Topogo      = require('topogo').Topogo
, Bling_Bling = require("bling_bling").Bling_Bling
, e_e_e       = require('escape_escape_escape').Sanitize.html
;


var Headline = exports.Headline = Ok.Model.new(function () {});

var TABLE_NAME = exports.Headline.TABLE_NAME = "Headline";
var TABLE = Topogo.new(TABLE_NAME);

Headline._new = function () {
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

Headline.create = function (raw_data, flow) {
  var data = {
    author     : raw_data.author,
    body       : e_e_e(raw_data.body),
    body_html  : Bling_Bling.new(raw_data.body_html).to_html();
  };

  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, record) {
    j.finish(Headline.new(record));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

Headline.read_by_website = function (website, flow) {
  var sql = "  \
  SELECT id, title, body, created_at, author_id         \n\
  FROM  @table                                          \n\
  WHERE @table.website_id = @website_id                 \n\
     AND @table.trashed_at IS NULL                      \n\
  ORDER BY id DESC                                      \n\
  LIMIT 25                                              \n\
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, {website_id: website.data.id}, j);
  })
  .job('replace screen_names', function (j, list) {
    Screen_Name.replace_screen_names(list, j);
  })
  .job('epoch times', function (j, list) {
    j.finish(_.map(list, function (r) {
      r.created_at_epoch = r.created_at && r.created_at.getTime();
      return r;
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






