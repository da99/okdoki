var _    = require('underscore')
, Check  = require('da_check').Check
, River  = require('da_river').River
, Topogo = require('topogo').Topogo
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
// ================================================================
// ================== Update ======================================
// ================================================================


// ================================================================
// ================== Trash =======================================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================







