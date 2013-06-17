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
    TABLE
    .create({
      num        : data.num,
      website_id : data.website_id,
      owner_id   : data.owner_id,
      title      : not_empty(data.title, "New Folder #" + data.num)
    }, j);
  })
  .job(function (j, row) {
    j.finish(Folder.new(row));
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







