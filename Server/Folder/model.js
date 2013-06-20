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

Folder.read_by_id = function (q, flow) {
  River.new(flow)
  .job(function (j) {
    TABLE.read_one(q, j);
  })
  .job(function (j, r) {
    return Folder.new(r);
  })
  .run();
};

Folder.read_list_by_website_id = function (website_id, customer, flow) {
  var vals = {
    website_id: website_id,
    sn_ids : customer,
    TABLES : {
      F: TABLE_NAME
    }
  };

  var sql = "\
    SELECT                                                               \n\
      @F.*                                                               \n\
                                                                         \n\
    FROM                                                                 \n\
      @F                                                                 \n\
                                                                         \n\
    WHERE                                                                \n\
      " + Topogo.where_readable(vals.TABLES) + "                         \n\
      AND website_id = @website_id                                       \n\
                                                                         \n\
    ORDER BY id DESC                                                     \n\
                                                                         \n\
                                                                         \n\
  ";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, vals, j);
  })
  .job(function (j, rows) {
    j.finish(_.map(rows, function (r) { return Folder.new(r); }));
  })
  .run();
};

Folder.read_by_screen_name_and_num = function (sn, num, customer, flow) {
  var f  = null
    , F  = TABLE_NAME
    , W  = Website.TABLE_NAME
    , SN = Screen_Name.TABLE_NAME;

  var vals = {
    num      : num,
    upper_sn : sn.toUpperCase(),
    sn_ids   : customer,
    TABLES: {
      F  : F,
      W  : W,
      SN : SN
  }};

  var sql = "\
  SELECT                                                                          \n\
    @F.*,                                                                         \n\
    @W.title AS website_title,                                                    \n\
    @SN.id   AS screen_name_id                                                    \n\
                                                                                  \n\
  FROM                                                                            \n\
    @F INNER JOIN @W ON @F.website_id = @W.id                                     \n\
      INNER JOIN @SN ON @SN.id = @W.owner_id                                      \n\
                                                                                  \n\
  WHERE                                                                           \n\
    @is_read_able                                                                 \n\
    AND @F.num          = @num                                                    \n\
    AND @SN.screen_name = @upper_sn                                               \n\
                                                                                  \n\
  LIMIT 1                                                                         \n\
  ;";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, vals, j)
  })
  .job(function (j, rows) {
    if (!rows.length)
      return j.finish(null);
    return j.finish(rows[0] && Folder.new(rows[0]));
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







