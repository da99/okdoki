
var  _        = require('underscore')
, Check       = require('da_check').Check
, River       = require('da_river').River
, Topogo      = require('topogo').Topogo
, Screen_Name = require('../Screen_Name/model').Screen_Name
, Bling_Bling = require("bling_bling").Bling_Bling
, e_e_e       = require('escape_escape_escape').Sanitize.html;
;


var TABLE_NAME = 'Message_Board';
var TABLE      = Topogo.new(TABLE_NAME);

var MB = exports.Message_Board = function () {};

MB.new = function (data) {
  var mb = new MB();
  mb.data = data || {};
  return mb;
};

// ================================================================
// ================== Helpers =====================================
// ================================================================
function empty_or (str, def) {
  var d = (str || "").trim();
  if (d.length)
    return d;
  return def;
}

function empty_or_null (str) {
  var d = (str || "").trim();
  if (d.length)
    return d;
  return null;
}

// ================================================================
// ================== Create ======================================
// ================================================================

MB.create = function (raw_data, flow) {
  var data = {
    owner      : raw_data.owner,
    author     : raw_data.author,
    body       : e_e_e(raw_data.body),
    body_html  : Bling_Bling.new(raw_data.body_html).to_html();
  };
  River.new(flow)
  .job(function (j) {
    TABLE.create(data, j);
  })
  .job(function (j, r) {
    j.finish(MB.new(_.pick(r, 'body', 'created_at')));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================
MB.read_by_website = function (website, flow) {
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







