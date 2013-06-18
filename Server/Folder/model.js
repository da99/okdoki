var _     = require('underscore')
, Check   = require('da_check').Check
, River   = require('da_river').River
, Topogo  = require('topogo').Topogo
, Website = require('../Website/model').Website
, Screen_Name = null
;
var TABLE_NAME = 'Folder';
var TABLE      = Topogo.new(TABLE_NAME);

function not_empty() {
  var args = _.toArray(arguments);
  return _.detect(args, function (v) {
    var val = (v || "").trim();
    if (val.length)
      return val;
  });
}

// ================================================================
// ================== Main Stuff ==================================
// ================================================================

var Folder = exports.Folder = function () {
};

Folder.screen_name = function (e) {
  Screen_Name = e.Screen_Name;
};

Folder.new = function (row) {
  var f = new Folder();
  f.data = row;
  return f;
};

// ================================================================
// ================== Create ======================================
// ================================================================

Folder.create = function (data, flow) {
  var f = Folder.new();
  River.new(flow)
  .job(function (j) {
    var new_data = {
      website_id : data.website_id,
      owner_id   : data.owner_id,
      title      : not_empty(data.title, null),
      def_title  : "New Folder #"
    };
    TABLE.run("\
              WITH next_num AS (SELECT coalesce(MAX(num),0) + 1 as num FROM @table WHERE website_id = @website_id) \n\
              INSERT INTO @table (num, website_id, owner_id, title) \n\
              VALUES( (SELECT num FROM next_num) , @website_id, @owner_id, coalesce(@title, CONCAT(CAST (@def_title AS char(123)), (SELECT num FROM next_num))) ) \n\
              RETURNING * ;", new_data, j);
  })
  .job(function (j, rows) {
    j.finish(Folder.new(rows[0]));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

Folder.read = function (q, flow) {
  River.new(flow)
  .job(function (j) {
    TABLE.read_list(q, j);
  })
  .job(function (j, list) {
    j.finish(_.map(list, function (r) {
      return Folder.new(r);
    }));
  })
  .run();
};

Folder.read_by_screen_name_and_num = function (sn, num, flow) {
  var f = null;
  var sql = "\
    SELECT @table.*                                          \
    FROM (@table INNER JOIN @ws_table                        \
      ON @table.website_id = @ws_table.id) INNER JOIN @sn_table \
      ON @ws_table.owner_id = @sn_table.id                   \
    WHERE num = @num AND @table.trashed_at IS NULL           \
    LIMIT 1                                                  \
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, {
      TABLES: {sn_table: Screen_Name.TABLE_NAME, ws_table: Website.TABLE_NAME},
      num: num
    }, j);
  })
  .job(function (j, rows) {
    if (!rows.length)
      return j.finish(null);
    return j.finish(Folder.new(rows[0]));
  })
  .job(function (j, folder) {
    f = folder;
    var sql = "\
    SELECT @page.*, @sn_table.screen_name AS author_screen_name   \
    FROM @page INNER JOIN @sn_table               \
      ON @page.author_id = @sn_table.id            \
    WHERE folder_id = @f_id AND @page.trashed_at IS NULL \
    ORDER BY id DESC;";
    TABLE.run(sql, {
      TABLES: {page: "Page", sn_table: Screen_Name.TABLE_NAME},
      f_id: f.data.id
    }, j);
  })
  .job(function (j, pages) {
    f.data.pages = pages;
    j.finish(f);
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================


// ================================================================
// ================== Trash =======================================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================







