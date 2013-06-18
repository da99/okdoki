
var  _        = require('underscore')
, Check       = require('da_check').Check
, River       = require('da_river').River
, Topogo      = require('topogo').Topogo
, Screen_Name = require('../Screen_Name/model').Screen_Name
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


// ================================================================
// ================== Create ======================================
// ================================================================

// ================================================================
// ================== Read ========================================
// ================================================================
MB.read_by_website_id = function (id, flow) {
  var sql = "  \
  SELECT @table.*,                                      \
    @screen_name_table.screen_name                      \
     AS author_screen_name                              \
  FROM  @table INNER JOIN @screen_name_table            \
        ON @table.author_id = @screen_name_table.id     \
  WHERE @table.website_id = @website_id AND @table.trashed_at IS NULL \
  LIMIT 10                                              \
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, {website_id: id, TABLES: {screen_name_table: Screen_Name.TABLE_NAME}}, j);
  })
  .job(function (j, list) {
    j.finish(_.map(list, function (r) {
      return MB.new(r);
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







