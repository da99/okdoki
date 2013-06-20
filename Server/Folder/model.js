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

Folder.prototype.is_readable_by = function (customer) {
  throw new Error("not implmented.");
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

Folder.read = function (q, customer, flow) {
  if (arguments.length === 2) {
    flow = customer;
    customer = null;
  }

  River.new(flow)
  .job(function (j) {
    TABLE.read_list(q, j);
  })
  .job(function (j, list) {
    j.finish(_.compact(_.map(list, function (r) {
      var f = Folder.new(r);
      if (customer && !f.is_readable_by(customer))
        return null;
      return Folder.new(r);
    })));
  })
  .run();
};

Folder.read_by_screen_name_and_num = function (sn, num, flow) {
  var f  = null
    , T  = TABLE_NAME
    , W  = Website.TABLE_NAME
    , SN = Screen_Name.TABLE_NAME;

  var pair = Topogo
  .select(
    [T, '*'],
    [W, 'owner_id', 'trashed_at'],
    [SN, 'screen_name', 'trashed_at']
  )
  .from([T, 'website_id'], [W, 'id'], 'inner join', 
        [SN, 'id'], [W, 'owner_id'], 'inner join')
  .where([T,'num'], '=', num, 'AND', [SN, 'screen_name'], '=', sn.toUpperCase())
  .limit(1)
  .end();

  River.new(flow)
  .job(function (j) {
    TABLE.run(pair[0], pair[1], j)
  })
  .job(function (j, rows) {
    if (!rows.length)
      return j.finish(null);
    return j.finish(rows[0] && Folder.new(rows[0]));
  })
  .job(function (j, folder) {
    if (!folder)
      return j.finish(null);

    f = folder;
    var sql = "\
    SELECT @page.*, @sn_table.screen_name AS author_screen_name   \n\
    FROM @page INNER JOIN @sn_table               \n\
      ON @page.author_id = @sn_table.id           \n\
    WHERE folder_id = @f_id                       \n\
    ORDER BY id DESC;";
    TABLE.run(sql, {
      TABLES: {page: "Page", sn_table: Screen_Name.TABLE_NAME},
      f_id: f.data.id
    }, j);
  })
  .job(function (j, pages) {
    f.data.pages = _.map(pages, function (p) { return Page.new(p); });
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







