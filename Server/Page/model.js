
var _ = require("underscore")
Folder = require("../Folder/model").Folder
Topogo = require("topogo").Topogo
River  = require("da_river").River
;


var P = exports.Page = function () {};
var TABLE_NAME = exports.P.TABLE_NAME = "Page";
var TABLE = Topogo.new(TABLE_NAME);

Page.new = function (data) {
  var p = new P();
  p.data = data;
  return p
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
Page.create = function (raw_data, flow) {
  var data = {
    folder_id: raw_data.folder_id || 1,
    author_id: raw_data.author_id || 0,
    title : null_if_empty(data.title) || "Rock on, daddy-o!",
    body  : null_if_empty(data.body)  || "Rock on, Sweet Cheeks."
  };

  if (!data.author_id)
    return flow.finish('invalid', "Invalid author id.");

  var sql = "";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .job(function (j, rows) {
    j.finish(Page.new(rows[0]));
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


