
var _    = require('underscore')
, Check  = require('da_check').Check
, River  = require('da_river').River
, Topogo = require('topogo').Topogo
;

var TABLE_NAME = 'Counter';

// ================================================================
// ================== Main Stuff ==================================
// ================================================================

var Counter = exports.Counter = function () {
};

Counter.new = function () {
  var c = new Counter();
  return c;
};

// ================================================================
// ================== Create ======================================
// ================================================================

Counter.create = function (parent_type, parent_id, child_type, child_id, flow) {
  var parent_type_id = type_id(parent_type);
  var child_type_id  = type_id(child_type);
  River.new(flow)
  .job(function (j) {
    Topogo.new(TABLE_NAME)
    .update_and_return_where_set({
      parent_type_id : parent_type_id,
      parent_id      : parent_id,
      child_type_id  : child_type_id,
      child_id       : child_id
    }, flow);
  })
  .job(function (j, last) {
    if (last)
      return j.finish(last);
    Topogo.new(TABLE_NAME)
    .not_done();
  })
  .run();
};






