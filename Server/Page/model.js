
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

Page.prototype.is_readable_by = function (customer) {
  throw new Error("not imolemented");
};

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

  var sql = "\
    WITH next_num AS (                        \n\
       SELECT coalesce(MAX(num),0) + 1 as num \n\
       FROM @table                            \n\
       WHERE folder_id = @folder_id           \n\
    )                                         \n\
    INSERT INTO @table (num, folder_id, author_id, title, body) \n\
    VALUES( (SELECT num FROM next_num) , @folder_id, @author_id, @title, @body ) \n\
    RETURNING * ;";

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
Page.read_by_screen_name_and_folder_num_and_page_num = function (sn, folder_num, page_num, flow) {
  var data = {upper_sn: sn.toUpperCase(), folder_num: folder_num, page_num: page_num}
  var sql = "\
    SELECT @table.*,                         \n\
     @f.title      AS folder_title,          \n\
     @f.num        AS folder_num             \n\
     @f.trashed_at AS folder_trashed_at      \n\
     @sn.trashed_at AS screen_name_trashed_at\n\
    FROM @table INNER JOIN @f          \n\
      ON @table.folder_id = @f.id      \n\
        INNER JOIN @sn                 \n\
          ON @sn.id = @f.owner_id      \n\
    WHERE
      @table.num = @num AND
      @f.num     = @folder_num AND
      @sn.screen_name = @upper_sn
    LIMIT 1
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .job(function (j, rows) {
    j.finish(rows[0] && Page.new(rows[0]));
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


